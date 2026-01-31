import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

type SectionId =
  | 'dashboard'
  | 'profile'
  | 'security'
  | 'personal-data'
  | 'documents'
  | 'history'
  | 'preferences'
  | 'billing'
  | 'subscriptions'
  | 'notifications'
  | 'integrations'
  | 'help'
  | 'contact'
  | 'feedback';

type ModalType = 'password' | 'profile' | 'preferences';

interface NavGroup {
  title: string;
  items: Array<{ id: SectionId; label: string; icon: string }>;
}

interface StatCard {
  label: string;
  value: string;
  trend: string;
  direction: 'up' | 'down';
}

interface Activity {
  id: string;
  timestamp: string;
  type: string;
  description: string;
  ipAddress: string;
  location: string;
  status: 'success' | 'failed';
}

interface Session {
  id: string;
  device: string;
  location: string;
  ipAddress: string;
  lastActivity: string;
  isCurrent: boolean;
}

interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
}

interface DataPoint {
  label: string;
  value: string;
  emphasis?: boolean;
}

interface DocumentRecord {
  id: string;
  name: string;
  category: string;
  size: string;
  updatedAt: string;
  status: 'verified' | 'pending';
}

interface InvoiceRecord {
  id: string;
  date: string;
  amount: string;
  status: 'paid' | 'pending';
  items: string[];
}

interface IntegrationRecord {
  id: string;
  name: string;
  status: 'connected' | 'disconnected';
  description: string;
  syncSchedule: string;
}

interface NotificationChannel {
  id: string;
  label: string;
  description: string;
  email: boolean;
  push: boolean;
  sms: boolean;
}

interface SubscriptionSummary {
  plan: string;
  price: string;
  renewal: string;
  usage: number;
  seats: { used: number; total: number };
  features: string[];
}

interface LiveMetrics {
  activeUsers: number;
  newSessions: number;
  securityEvents: number;
  dataOperations: number;
  systemAlerts: number;
}

interface AnalyticsInsight {
  id: string;
  summary: string;
  detail: string;
  timestamp: string;
}

interface BackgroundJob {
  id: string;
  label: string;
  intervalLabel: string;
  lastRun: string;
  nextRun: string;
  status: 'idle' | 'running';
}

interface BackgroundJobUpdate {
  id: string;
  label: string;
  status: 'idle' | 'running';
  timestamp: string;
  nextRun: string;
}

class RealTimeDataStream {
  private timer?: number;

  constructor(
    private readonly onMetrics: (metrics: LiveMetrics) => void,
    private readonly onActivity: (activity: Activity) => void
  ) {}

  start(): void {
    if (this.timer) {
      return;
    }

    this.timer = window.setInterval(() => {
      const metrics = this.generateMetrics();
      this.onMetrics(metrics);

      if (Math.random() > 0.6) {
        this.onActivity(this.generateActivity());
      }
    }, 1000);
  }

  stop(): void {
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  private generateMetrics(): LiveMetrics {
    return {
      activeUsers: 700 + Math.floor(Math.random() * 200),
      newSessions: 10 + Math.floor(Math.random() * 40),
      securityEvents: Math.floor(Math.random() * 12),
      dataOperations: 100 + Math.floor(Math.random() * 250),
      systemAlerts: Math.floor(Math.random() * 5)
    };
  }

  private generateActivity(): Activity {
    const types = ['login', 'data_export', 'preference_update', 'security_event'];
    const descriptions = [
      'Real-time sync updated profile data',
      'Live security event resolved automatically',
      'Streaming analytics captured a spike in usage',
      'Background reconciliation completed'
    ];

    return {
      id: `STREAM_${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: types[Math.floor(Math.random() * types.length)],
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      ipAddress: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      location: ['New York, US', 'London, UK', 'Tokyo, JP'][Math.floor(Math.random() * 3)],
      status: Math.random() > 0.1 ? 'success' : 'failed'
    };
  }
}

class AdvancedAnalyticsEngine {
  private readonly listeners: Array<{ type: keyof DocumentEventMap; handler: EventListener }>= [];
  private queue: AnalyticsInsight[] = [];
  private flushTimer?: number;

  constructor(private readonly onInsight: (insight: AnalyticsInsight) => void) {}

  start(): void {
    if (this.listeners.length) {
      return;
    }

    const observedEvents: Array<keyof DocumentEventMap> = ['click', 'input', 'scroll'];
    observedEvents.forEach(type => {
      const handler = (event: Event) => this.enqueue(type, event);
      document.addEventListener(type, handler, { passive: true });
      this.listeners.push({ type, handler });
    });

    this.flushTimer = window.setInterval(() => this.flush('scheduled'), 15_000);
  }

  stop(): void {
    this.listeners.forEach(({ type, handler }) => document.removeEventListener(type, handler));
    this.listeners.length = 0;
    if (this.flushTimer) {
      window.clearInterval(this.flushTimer);
      this.flushTimer = undefined;
    }
  }

  private enqueue(type: keyof DocumentEventMap, event: Event): void {
    const insight: AnalyticsInsight = {
      id: `ANL_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      summary: `${type} interaction tracked`,
      detail: `Target: ${(event.target as HTMLElement | null)?.tagName ?? 'UNKNOWN'}`,
      timestamp: new Date().toISOString()
    };

    this.queue.push(insight);

    if (this.queue.length >= 25) {
      this.flush('threshold');
    }
  }

  private flush(reason: 'threshold' | 'scheduled'): void {
    if (!this.queue.length) {
      return;
    }

    const batch = this.queue.splice(0, this.queue.length);
    const summary = `${batch.length} interactions processed (${reason}).`;
    const detail = batch
      .slice(0, 3)
      .map(item => item.detail)
      .join(' • ');

    this.onInsight({
      id: `INS_${Date.now()}`,
      summary,
      detail: detail || 'No additional context captured.',
      timestamp: new Date().toISOString()
    });
  }
}

class BackgroundProcessor {
  private readonly timers: number[] = [];
  private readonly jobs = [
    { id: 'data-aggregation', label: 'Data Aggregation', interval: 30_000 },
    { id: 'security-scan', label: 'Security Scan', interval: 60_000 },
    { id: 'preference-backup', label: 'Preference Backup', interval: 120_000 },
    { id: 'api-sync', label: 'Partner API Sync', interval: 180_000 }
  ];

  constructor(private readonly onUpdate: (update: BackgroundJobUpdate) => void) {}

  start(): void {
    if (this.timers.length) {
      return;
    }

    this.jobs.forEach(job => {
      const runJob = () => {
        const nextRun = new Date(Date.now() + job.interval).toISOString();
        this.onUpdate({ id: job.id, label: job.label, status: 'running', timestamp: new Date().toISOString(), nextRun });
        window.setTimeout(() => {
          this.onUpdate({ id: job.id, label: job.label, status: 'idle', timestamp: new Date().toISOString(), nextRun });
        }, 1200);
      };

      runJob();
      const handle = window.setInterval(runJob, job.interval);
      this.timers.push(handle);
    });
  }

  stop(): void {
    this.timers.forEach(timer => window.clearInterval(timer));
    this.timers.length = 0;
  }
}

@Component({
  selector: 'app-customer-portal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-portal.component.html',
  styleUrls: ['./customer-portal.component.scss']
})
export class CustomerPortalComponent implements OnInit, OnDestroy {
  private readonly sectionLabels: Record<SectionId, string> = {
    dashboard: 'Dashboard Overview',
    profile: 'Profile Management',
    security: 'Security Center',
    'personal-data': 'Personal Data Management',
    documents: 'Document Storage',
    history: 'Activity History',
    preferences: 'Preferences & Settings',
    billing: 'Billing & Payments',
    subscriptions: 'Subscription Management',
    notifications: 'Notification Settings',
    integrations: 'Third-party Integrations',
    help: 'Help Center',
    contact: 'Contact Support',
    feedback: 'Feedback & Suggestions'
  };

  readonly navGroups: NavGroup[] = [
    {
      title: 'Main',
      items: [
        { id: 'dashboard', label: 'Dashboard Overview', icon: '📊' },
        { id: 'profile', label: 'Profile Management', icon: '👤' },
        { id: 'security', label: 'Security Center', icon: '🔒' }
      ]
    },
    {
      title: 'Data Management',
      items: [
        { id: 'personal-data', label: 'Personal Data', icon: '📁' },
        { id: 'documents', label: 'Documents', icon: '📄' },
        { id: 'history', label: 'Activity History', icon: '🕒' },
        { id: 'preferences', label: 'Preferences', icon: '⚙️' }
      ]
    },
    {
      title: 'Account Settings',
      items: [
        { id: 'billing', label: 'Billing & Payments', icon: '💳' },
        { id: 'subscriptions', label: 'Subscriptions', icon: '🔄' },
        { id: 'notifications', label: 'Notifications', icon: '🔔' },
        { id: 'integrations', label: 'Integrations', icon: '🔗' }
      ]
    },
    {
      title: 'Support',
      items: [
        { id: 'help', label: 'Help Center', icon: '❓' },
        { id: 'contact', label: 'Contact Support', icon: '📞' },
        { id: 'feedback', label: 'Feedback', icon: '💬' }
      ]
    }
  ];

  readonly liveMetricLabels: Record<keyof LiveMetrics, string> = {
    activeUsers: 'Active Users',
    newSessions: 'New Sessions',
    securityEvents: 'Security Events',
    dataOperations: 'Data Operations',
    systemAlerts: 'System Alerts'
  };

  readonly statCards = signal<StatCard[]>([
    { label: 'Total Data Entries', value: '1,247', trend: '↑ 12% from last month', direction: 'up' },
    { label: 'Profile Completeness', value: '89%', trend: '↑ 5% this week', direction: 'up' },
    { label: 'Active Sessions', value: '42', trend: '↓ 3% from yesterday', direction: 'down' },
    { label: 'Security Events', value: '156', trend: '↓ 28% this month', direction: 'down' }
  ]);

  readonly activityLog = signal<Activity[]>(this.generateActivityLog());
  readonly sessions = signal<Session[]>(this.generateSessions());

  readonly activeSection = signal<SectionId>('dashboard');
  readonly pageTitle = computed(() => this.sectionLabels[this.activeSection()]);

  readonly searchTerm = signal('');
  searchTermModel = '';
  readonly filteredActivities = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const activities = this.activityLog();
    if (!term) {
      return activities.slice(0, 10);
    }

    return activities
      .filter(
        activity =>
          activity.description.toLowerCase().includes(term) ||
          activity.type.toLowerCase().includes(term) ||
          activity.location.toLowerCase().includes(term) ||
          activity.ipAddress.includes(term)
      )
      .slice(0, 10);
  });
  readonly liveMetricEntries = computed(() => {
    const metrics = this.liveMetrics();
    const keys = Object.keys(this.liveMetricLabels) as Array<keyof LiveMetrics>;
    return keys.map(key => ({ key, label: this.liveMetricLabels[key], value: metrics[key] }));
  });
  readonly subscriptionSeatPercent = computed(() =>
    Math.round((this.subscriptionSummary.seats.used / this.subscriptionSummary.seats.total) * 100)
  );

  readonly toast = signal<Toast | null>(null);
  readonly isExporting = signal(false);
  readonly openModal = signal<ModalType | null>(null);
  readonly liveMetrics = signal<LiveMetrics>(this.generateInitialLiveMetrics());
  readonly analyticsInsights = signal<AnalyticsInsight[]>(this.seedAnalyticsInsights());
  readonly backgroundJobs = signal<BackgroundJob[]>(this.createBackgroundJobs());
  readonly documentLibrary = signal<DocumentRecord[]>(this.generateDocumentLibrary());
  readonly invoiceHistory = signal<InvoiceRecord[]>(this.generateInvoices());
  readonly integrationCatalog = signal<IntegrationRecord[]>(this.generateIntegrations());
  readonly personalSnapshot: DataPoint[] = [
    { label: 'Customer ID', value: 'USR-001', emphasis: true },
    { label: 'Tier', value: 'Premium' },
    { label: 'Member Since', value: 'Jan 15, 2022' },
    { label: 'Last Verification', value: 'Oct 2, 2024' }
  ];
  readonly notificationChannels: NotificationChannel[] = [
    { id: 'security', label: 'Security Alerts', description: 'Critical account and login events', email: true, push: true, sms: true },
    { id: 'billing', label: 'Billing Updates', description: 'Invoices, receipts, and payment reminders', email: true, push: false, sms: false },
    { id: 'product', label: 'Product Updates', description: 'New features and roadmap highlights', email: true, push: true, sms: false }
  ];
  readonly subscriptionSummary: SubscriptionSummary = {
    plan: 'Premium',
    price: '$29.99 / month',
    renewal: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    usage: 78,
    seats: { used: 38, total: 50 },
    features: ['Unlimited Storage', 'Priority Support', 'Advanced Analytics', 'Audit-ready Exports']
  };

  profileForm = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Senior software engineer with 8+ years of experience in full-stack development.',
    theme: 'light',
    language: 'en-US'
  };

  passwordForm = {
    current: '',
    next: '',
    confirm: ''
  };

  preferencesForm = {
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    timezone: 'America/New_York'
  };

  private readonly intervalHandles: number[] = [];
  private realTimeStream?: RealTimeDataStream;
  private analyticsEngine?: AdvancedAnalyticsEngine;
  private backgroundProcessor?: BackgroundProcessor;

  ngOnInit(): void {
    this.intervalHandles.push(window.setInterval(() => this.simulateRealTimeMetrics(), 30_000));
    this.intervalHandles.push(window.setInterval(() => this.refreshSessions(), 60_000));

    this.realTimeStream = new RealTimeDataStream(
      metrics => this.liveMetrics.set(metrics),
      activity => this.appendStreamActivity(activity)
    );
    this.realTimeStream.start();

    this.analyticsEngine = new AdvancedAnalyticsEngine(insight => this.pushAnalyticsInsight(insight));
    this.analyticsEngine.start();

    this.backgroundProcessor = new BackgroundProcessor(update => this.handleJobStatus(update));
    this.backgroundProcessor.start();
  }

  ngOnDestroy(): void {
    this.intervalHandles.forEach(handle => window.clearInterval(handle));
    this.intervalHandles.length = 0;

    this.realTimeStream?.stop();
    this.analyticsEngine?.stop();
    this.backgroundProcessor?.stop();
  }

  setActiveSection(section: SectionId): void {
    this.activeSection.set(section);
  }

  setSearchTerm(term: string): void {
    this.searchTerm.set(term);
  }

  openModalDialog(modal: ModalType): void {
    this.openModal.set(modal);
  }

  closeModal(): void {
    this.openModal.set(null);
  }

  changePassword(): void {
    const { current, next, confirm } = this.passwordForm;

    if (!current || !next || !confirm) {
      this.showToast('Please complete all password fields.', 'error');
      return;
    }

    if (next.length < 8) {
      this.showToast('Password must be at least 8 characters long.', 'error');
      return;
    }

    if (next !== confirm) {
      this.showToast('New passwords do not match.', 'error');
      return;
    }

    this.logActivity('password_change', 'Password updated successfully');
    this.showToast('Password updated successfully.', 'success');
    this.passwordForm = { current: '', next: '', confirm: '' };
    this.closeModal();
  }

  updateProfile(): void {
    this.logActivity('profile_update', 'Profile information updated');
    this.showToast('Profile saved successfully.', 'success');
    this.closeModal();
  }

  updatePreferences(): void {
    this.logActivity('preferences_update', 'Preferences updated');
    this.showToast('Preferences updated.', 'success');
    this.closeModal();
  }

  exportAllData(): void {
    if (this.isExporting()) {
      return;
    }

    this.isExporting.set(true);
    this.showToast('Preparing your export…', 'info');

    window.setTimeout(() => {
      this.logActivity('data_export', 'Complete data export requested');
      this.isExporting.set(false);
      this.showToast('Data export completed successfully.', 'success');
    }, 2000);
  }

  revokeSession(sessionId: string): void {
    this.sessions.update(list => list.filter(session => session.id !== sessionId));
    this.logActivity('session_revoke', `Session ${sessionId} revoked`);
    this.showToast('Session revoked.', 'info');
  }

  private simulateRealTimeMetrics(): void {
    this.statCards.update(cards =>
      cards.map(card => {
        if (card.label === 'Total Data Entries') {
          const nextValue = Number(card.value.replace(/,/g, '')) + Math.floor(Math.random() * 25);
          return { ...card, value: nextValue.toLocaleString() };
        }

        if (card.label === 'Security Events') {
          const delta = Math.floor(Math.random() * 5);
          const nextValue = Math.max(120, Number(card.value) + (Math.random() > 0.5 ? delta : -delta));
          return { ...card, value: String(nextValue) };
        }

        return card;
      })
    );

    const newActivity: Activity = {
      id: `ACT_${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'system_activity',
      description: 'Background synchronization completed',
      ipAddress: '192.168.1.1',
      location: 'System',
      status: 'success'
    };

    this.activityLog.update(log => [newActivity, ...log].slice(0, 60));
  }

  private refreshSessions(): void {
    this.sessions.update(list =>
      list.map(session =>
        session.isCurrent
          ? { ...session, lastActivity: new Date().toISOString() }
          : session
      )
    );
  }

  private appendStreamActivity(activity: Activity): void {
    this.activityLog.update(log => [activity, ...log].slice(0, 60));
  }

  private pushAnalyticsInsight(insight: AnalyticsInsight): void {
    this.analyticsInsights.update(list => [insight, ...list].slice(0, 6));
  }

  private handleJobStatus(update: BackgroundJobUpdate): void {
    this.backgroundJobs.update(jobs =>
      jobs.map(job =>
        job.id === update.id
          ? {
              ...job,
              status: update.status,
              lastRun: update.status === 'running' ? new Date(update.timestamp).toLocaleTimeString() : job.lastRun,
              nextRun: new Date(update.nextRun).toLocaleTimeString()
            }
          : job
      )
    );

    if (update.status === 'running') {
      this.logActivity('background_job', `${update.label} executed`);
    }
  }

  private showToast(message: string, type: Toast['type']): void {
    this.toast.set({ message, type });
    window.setTimeout(() => this.toast.set(null), 4000);
  }

  private logActivity(type: string, description: string): void {
    const entry: Activity = {
      id: `ACT_${Date.now()}`,
      timestamp: new Date().toISOString(),
      type,
      description,
      ipAddress: '192.168.1.1',
      location: 'New York, US',
      status: 'success'
    };

    this.activityLog.update(log => [entry, ...log].slice(0, 60));
  }

  private generateInitialLiveMetrics(): LiveMetrics {
    return {
      activeUsers: 820,
      newSessions: 32,
      securityEvents: 4,
      dataOperations: 215,
      systemAlerts: 1
    };
  }

  private seedAnalyticsInsights(): AnalyticsInsight[] {
    return [
      {
        id: 'INS_001',
        summary: '42 interactions processed (initial seed).',
        detail: 'Dashboard widgets clicked • Profile form focused • Quick action invoked',
        timestamp: new Date().toISOString()
      }
    ];
  }

  private createBackgroundJobs(): BackgroundJob[] {
    return [
      { id: 'data-aggregation', label: 'Data Aggregation', intervalLabel: 'Every 30s', lastRun: '-', nextRun: '-', status: 'idle' },
      { id: 'security-scan', label: 'Security Scan', intervalLabel: 'Every 60s', lastRun: '-', nextRun: '-', status: 'idle' },
      { id: 'preference-backup', label: 'Preference Backup', intervalLabel: 'Every 2m', lastRun: '-', nextRun: '-', status: 'idle' },
      { id: 'api-sync', label: 'Partner API Sync', intervalLabel: 'Every 3m', lastRun: '-', nextRun: '-', status: 'idle' }
    ];
  }

  private generateActivityLog(): Activity[] {
    const descriptions = [
      'Two-factor authentication enabled',
      'Profile updated',
      'New device registered',
      'Payment method added',
      'Privacy settings updated',
      'Subscription upgraded',
      'Data export completed'
    ];

    return Array.from({ length: 25 }).map((_, index) => ({
      id: `ACT_${1000 + index}`,
      timestamp: new Date(Date.now() - index * 3_600_000).toISOString(),
      type: ['login', 'profile_update', 'security_event'][index % 3],
      description: descriptions[index % descriptions.length],
      ipAddress: `192.168.0.${10 + index}`,
      location: ['New York, US', 'London, UK', 'Tokyo, JP'][index % 3],
      status: index % 7 === 0 ? 'failed' : 'success'
    }));
  }

  private generateSessions(): Session[] {
    return [
      {
        id: 'SESS_001',
        device: 'Chrome on Windows',
        location: 'New York, US',
        ipAddress: '192.168.1.15',
        lastActivity: new Date().toISOString(),
        isCurrent: true
      },
      {
        id: 'SESS_002',
        device: 'Safari on macOS',
        location: 'London, UK',
        ipAddress: '192.168.1.52',
        lastActivity: new Date(Date.now() - 3_600_000).toISOString(),
        isCurrent: false
      },
      {
        id: 'SESS_003',
        device: 'Mobile Safari',
        location: 'Toronto, CA',
        ipAddress: '192.168.1.77',
        lastActivity: new Date(Date.now() - 5_400_000).toISOString(),
        isCurrent: false
      }
    ];
  }

  private generateDocumentLibrary(): DocumentRecord[] {
    return [
      { id: 'DOC-1001', name: 'Identity Verification.pdf', category: 'Compliance', size: '1.2 MB', updatedAt: '2024-10-02T10:15:00Z', status: 'verified' },
      { id: 'DOC-1002', name: 'Quarterly Statement.xlsx', category: 'Billing', size: '824 KB', updatedAt: '2024-09-15T08:45:00Z', status: 'verified' },
      { id: 'DOC-1003', name: 'Security Audit Report.docx', category: 'Security', size: '2.4 MB', updatedAt: '2024-08-28T14:23:00Z', status: 'pending' }
    ];
  }

  private generateInvoices(): InvoiceRecord[] {
    return Array.from({ length: 6 }).map((_, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - index);
      return {
        id: `INV-${202400 + index}`,
        date: date.toISOString(),
        amount: `$${(89 + index * 5).toFixed(2)}`,
        status: index === 0 ? 'pending' : 'paid',
        items: ['Premium Subscription', index % 2 === 0 ? 'Advanced Analytics Add-on' : 'Data Residency Pack']
      };
    });
  }

  private generateIntegrations(): IntegrationRecord[] {
    return [
      { id: 'integr-01', name: 'Salesforce', status: 'connected', description: 'Sync customer accounts and opportunities every 30 minutes.', syncSchedule: 'Every 30m' },
      { id: 'integr-02', name: 'Zendesk', status: 'connected', description: 'Surface support tickets inside the customer profile.', syncSchedule: 'Real-time' },
      { id: 'integr-03', name: 'Slack', status: 'disconnected', description: 'Push proactive notifications into the #customer-success channel.', syncSchedule: 'Manual' }
    ];
  }
}
