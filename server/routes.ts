import express, { type Request, type Response, type NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import { store, type Project, type Category } from './dataStore.ts';

export const apiRouter = express.Router();

// Middleware: parse JSON
apiRouter.use(express.json({ limit: '10mb' }));
apiRouter.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Multer storage setup for persistent disk uploads
const uploadsDir = path.resolve(process.cwd(), 'public/uploads');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e6)}`;
    cb(null, `${cleanBase}_${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max file size (supports short animation MP4s and high-res art)
  },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
      'video/mp4',
      'video/webm',
      'video/quicktime'
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} is not supported. Please upload JPG, PNG, WebP, GIF, SVG, MP4, or WebM.`));
    }
  }
});

// Admin Authorization Guard
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;

  if (!store.validateSession(token)) {
    res.status(401).json({ error: 'Unauthorized: Admin authentication required.' });
    return;
  }
  next();
}

// ----------------------------------------
// PUBLIC ENDPOINTS
// ----------------------------------------

apiRouter.get('/public/data', (_req: Request, res: Response) => {
  const db = store.getData();
  const publishedProjects = db.projects
    .filter(p => p.isPublished)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const visibleCategories = db.categories
    .filter(c => c.visible)
    .sort((a, b) => a.order - b.order);

  const enabledServices = db.services
    .filter(s => s.enabled)
    .sort((a, b) => a.order - b.order);

  const enabledSocialLinks = db.socialLinks
    .filter(s => s.enabled)
    .sort((a, b) => a.order - b.order);

  res.json({
    profile: db.profile,
    categories: visibleCategories,
    projects: publishedProjects,
    services: enabledServices,
    socialLinks: enabledSocialLinks,
    software: db.software.sort((a, b) => a.order - b.order),
    appearance: db.appearance
  });
});

apiRouter.get('/public/projects/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  const project = store.getProjectBySlug(slug);

  if (!project) {
    res.status(404).json({ error: 'Project not found.' });
    return;
  }

  // If draft, only allow if admin session provided
  if (!project.isPublished) {
    const token = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : undefined;
    if (!store.validateSession(token)) {
      res.status(404).json({ error: 'Project not found.' });
      return;
    }
  }

  res.json(project);
});

apiRouter.post('/public/inquiries', (req: Request, res: Response) => {
  const { name, email, projectType, budget, message } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    res.status(400).json({ error: 'Please provide a valid name (at least 2 characters).' });
    return;
  }
  if (!email || typeof email !== 'string' || !email.includes('@') || !email.includes('.')) {
    res.status(400).json({ error: 'Please provide a valid email address.' });
    return;
  }
  if (!message || typeof message !== 'string' || message.trim().length < 10) {
    res.status(400).json({ error: 'Please describe your project idea (at least 10 characters).' });
    return;
  }

  const record = store.addInquiry({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    projectType: projectType || '2D Animation',
    budget: budget || undefined,
    message: message.trim()
  });

  res.status(201).json({
    success: true,
    message: 'Thank you for reaching out! Your inquiry has been received directly by Shoyen Kaiser Asif.',
    inquiryId: record.id
  });
});

// ----------------------------------------
// AUTHENTICATION ENDPOINTS
// ----------------------------------------

apiRouter.get('/auth/status', (req: Request, res: Response) => {
  const isConfigured = store.isAuthConfigured();
  const token = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : undefined;
  const isAuthenticated = store.validateSession(token);

  res.json({
    isConfigured,
    isAuthenticated
  });
});

apiRouter.post('/auth/setup', (req: Request, res: Response) => {
  if (store.isAuthConfigured()) {
    res.status(400).json({ error: 'Admin account has already been initialized.' });
    return;
  }

  const { password } = req.body;
  if (!password || password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    return;
  }

  const result = store.setupAdminPassword(password);
  if (!result.success) {
    res.status(400).json({ error: result.error });
    return;
  }

  res.json({ success: true, token: result.token });
});

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { password } = req.body;
  if (!password) {
    res.status(400).json({ error: 'Password is required.' });
    return;
  }

  const result = store.verifyAdminPassword(password);
  if (!result.success) {
    res.status(401).json({ error: result.error });
    return;
  }

  res.json({ success: true, token: result.token });
});

apiRouter.post('/auth/logout', (req: Request, res: Response) => {
  const token = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : undefined;
  if (token) {
    store.logout(token);
  }
  res.json({ success: true });
});

// ----------------------------------------
// PROTECTED ADMIN ENDPOINTS
// ----------------------------------------

apiRouter.get('/admin/overview', requireAdmin, (_req: Request, res: Response) => {
  const db = store.getData();
  const totalProjects = db.projects.length;
  const publishedProjects = db.projects.filter(p => p.isPublished).length;
  const draftProjects = totalProjects - publishedProjects;
  const totalCategories = db.categories.length;
  const totalMedia = db.mediaAssets.length;
  const unreadInquiries = db.inquiries.filter(i => i.status === 'unread').length;

  res.json({
    totalProjects,
    publishedProjects,
    draftProjects,
    totalCategories,
    totalMedia,
    unreadInquiries
  });
});

apiRouter.get('/admin/projects', requireAdmin, (_req: Request, res: Response) => {
  res.json(store.getProjects(true));
});

apiRouter.post('/admin/projects', requireAdmin, (req: Request, res: Response) => {
  const { title } = req.body;
  if (!title || typeof title !== 'string' || !title.trim()) {
    res.status(400).json({ error: 'Project title is required.' });
    return;
  }
  const saved = store.saveProject(req.body);
  res.json(saved);
});

apiRouter.post('/admin/projects/duplicate/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const original = store.getProjectById(id);
  if (!original) {
    res.status(404).json({ error: 'Original project not found.' });
    return;
  }
  const duplicated: Partial<Project> = {
    ...original,
    id: undefined,
    title: `${original.title} (Copy)`,
    slug: `${original.slug}-copy-${Date.now()}`,
    isPublished: false,
    displayOrder: store.getData().projects.length + 1
  };
  const saved = store.saveProject(duplicated as any);
  res.json(saved);
});

apiRouter.delete('/admin/projects/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = store.deleteProject(id);
  if (!deleted) {
    res.status(404).json({ error: 'Project not found.' });
    return;
  }
  res.json({ success: true });
});

apiRouter.post('/admin/projects/reorder', requireAdmin, (req: Request, res: Response) => {
  const { orderedIds } = req.body;
  if (!Array.isArray(orderedIds)) {
    res.status(400).json({ error: 'orderedIds array required.' });
    return;
  }
  const updated = store.reorderProjects(orderedIds);
  res.json(updated);
});

apiRouter.get('/admin/categories', requireAdmin, (_req: Request, res: Response) => {
  res.json(store.getCategories());
});

apiRouter.post('/admin/categories', requireAdmin, (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name || typeof name !== 'string') {
    res.status(400).json({ error: 'Category name is required.' });
    return;
  }
  const saved = store.saveCategory(req.body);
  res.json(saved);
});

apiRouter.delete('/admin/categories/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const result = store.deleteCategory(id);
  if (!result.success) {
    res.status(400).json({ error: result.reason });
    return;
  }
  res.json({ success: true });
});

apiRouter.post('/admin/profile', requireAdmin, (req: Request, res: Response) => {
  const updated = store.updateProfile(req.body);
  res.json(updated);
});

apiRouter.post('/admin/services', requireAdmin, (req: Request, res: Response) => {
  const { services } = req.body;
  if (!Array.isArray(services)) {
    res.status(400).json({ error: 'Services array expected.' });
    return;
  }
  const updated = store.updateServices(services);
  res.json(updated);
});

apiRouter.post('/admin/social-links', requireAdmin, (req: Request, res: Response) => {
  const { socialLinks } = req.body;
  if (!Array.isArray(socialLinks)) {
    res.status(400).json({ error: 'Social links array expected.' });
    return;
  }
  const updated = store.updateSocialLinks(socialLinks);
  res.json(updated);
});

apiRouter.post('/admin/software', requireAdmin, (req: Request, res: Response) => {
  const { software } = req.body;
  if (!Array.isArray(software)) {
    res.status(400).json({ error: 'Software array expected.' });
    return;
  }
  const updated = store.updateSoftware(software);
  res.json(updated);
});

apiRouter.post('/admin/appearance', requireAdmin, (req: Request, res: Response) => {
  const updated = store.updateAppearance(req.body);
  res.json(updated);
});

apiRouter.post('/admin/appearance/reset', requireAdmin, (_req: Request, res: Response) => {
  store.resetToDefaults();
  res.json(store.getData().appearance);
});

apiRouter.get('/admin/inquiries', requireAdmin, (_req: Request, res: Response) => {
  res.json(store.getInquiries());
});

apiRouter.patch('/admin/inquiries/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!['unread', 'read', 'archived'].includes(status)) {
    res.status(400).json({ error: 'Invalid inquiry status.' });
    return;
  }
  const success = store.updateInquiryStatus(id, status);
  if (!success) {
    res.status(404).json({ error: 'Inquiry not found.' });
    return;
  }
  res.json({ success: true });
});

apiRouter.delete('/admin/inquiries/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const success = store.deleteInquiry(id);
  if (!success) {
    res.status(404).json({ error: 'Inquiry not found.' });
    return;
  }
  res.json({ success: true });
});

apiRouter.get('/admin/media', requireAdmin, (_req: Request, res: Response) => {
  res.json(store.getMediaAssets());
});

apiRouter.post('/admin/media/upload', requireAdmin, (req: Request, res: Response) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      res.status(400).json({ error: err.message || 'File upload failed.' });
      return;
    }
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded.' });
      return;
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const asset = store.addMediaAsset({
      filename: req.file.filename,
      originalName: req.file.originalname,
      url: fileUrl,
      size: req.file.size,
      mimeType: req.file.mimetype,
      altText: req.body.altText || req.file.originalname
    });

    res.json(asset);
  });
});

apiRouter.delete('/admin/media/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const result = store.deleteMediaAsset(id);
  if (!result.success) {
    res.status(400).json({ error: result.reason });
    return;
  }
  res.json({ success: true });
});

apiRouter.post('/admin/change-password', requireAdmin, (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    res.status(400).json({ error: 'Old password and new password are required.' });
    return;
  }
  const result = store.changePassword(oldPassword, newPassword);
  if (!result.success) {
    res.status(400).json({ error: result.error });
    return;
  }
  res.json({ success: true });
});
