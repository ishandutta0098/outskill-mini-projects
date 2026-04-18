# Product Spec: Lumen Mobile (v1.0)

**Product**: Lumen Mobile is a native iOS and Android companion app for the Lumen
analytics web product. It lets product managers triage anomalies, comment on dashboards,
and approve experiment changes from their phone.

**Target launch date**: 2026-08-12 (8 weeks out)

**Target audience**:
- Existing Lumen Pro and Enterprise customers (~6,500 paid workspaces)
- Primarily PMs, growth managers, and engineering leads who already use Lumen daily
- US, EU, and India time zones

**Core features for v1.0**:
1. Push notifications for triggered anomaly alerts (configurable thresholds)
2. Read-only dashboard viewing with chart drill-down
3. Threaded comments on charts and reports
4. Experiment approval flow (approve / reject / request changes)
5. Workspace switcher for users in multiple workspaces
6. Biometric login (Face ID / Touch ID / Android equivalent)

**Out of scope for v1.0**:
- Editing dashboards or running new queries
- Inviting new workspace members
- Billing / plan management

**Pricing**: Included free with all paid Lumen plans. No new SKU.

**Distribution**: Apple App Store + Google Play Store. No enterprise MDM bundle for v1.0.

**Success metrics (90 days post-launch)**:
- 30% of paid workspaces have at least one active mobile user
- Median anomaly-alert acknowledgement time drops from 2h 15m -> under 30m
- Mobile-driven comments make up at least 15% of total comments

**Known risks**:
- App Store review timing can blow the launch date
- Push notification reliability across iOS background modes
- Cold start performance on older Android devices
