import type { LogLine, ProjectDef } from "../schema";

export type ToolCall = {
  tool: string;
  input: string;
  output: string;
};

export type AgentOutput = {
  agent: string;
  output: string;
  tools: ToolCall[];
  context?: string[];
};

export type VersionData = {
  label: string;
  agentOutputs: AgentOutput[];
  log: LogLine[];
};

const DUMMY_LOG = `2024-10-10T14:32:15.123Z [INFO] Starting deployment of myapp:v1.2.3
2024-10-10T14:32:15.456Z [INFO] Applying deployment configuration...
2024-10-10T14:32:15.789Z [INFO] Creating deployment myapp-deployment in namespace production
2024-10-10T14:32:16.012Z [INFO] Deployment created successfully
2024-10-10T14:32:16.234Z [INFO] Waiting for pods to be ready...
2024-10-10T14:32:16.567Z [WARNING] Pod myapp-deployment-7b8c9d5f4-abc12 is in Pending state
2024-10-10T14:32:17.890Z [ERROR] Pod myapp-deployment-7b8c9d5f4-abc12 failed to start
2024-10-10T14:32:18.123Z [ERROR] Event: Failed to pull image "myapp:v1.2.3": rpc error: code = Unknown desc = Error response from daemon: pull access denied for myapp, repository does not exist or may require 'docker login'
2024-10-10T14:32:18.456Z [ERROR] Pod myapp-deployment-7b8c9d5f4-abc12 status: ImagePullBackOff
2024-10-10T14:32:19.789Z [WARNING] Back-off pulling image "myapp:v1.2.3"
2024-10-10T14:32:20.012Z [ERROR] kubelet: Failed to pull image "myapp:v1.2.3": rpc error: code = Unknown desc = Error response from daemon: pull access denied
2024-10-10T14:32:21.345Z [ERROR] kubelet: Error syncing pod: ErrImagePull
2024-10-10T14:32:22.678Z [WARNING] Pod myapp-deployment-7b8c9d5f4-abc12 has been in ImagePullBackOff state for 5 seconds
2024-10-10T14:32:25.901Z [ERROR] Deployment rollout failed: deployment "myapp-deployment" exceeded its progress deadline
2024-10-10T14:32:26.234Z [ERROR] ReplicaSet myapp-deployment-7b8c9d5f4 has 0 ready replicas out of 3 desired
2024-10-10T14:32:26.567Z [INFO] Current deployment status: 0/3 pods ready
2024-10-10T14:32:27.890Z [WARNING] Deployment health check failed: no healthy pods found
2024-10-10T14:32:28.123Z [ERROR] Service myapp-service has no available endpoints
2024-10-10T14:32:29.456Z [CRITICAL] Production deployment failed - rollback initiated
2024-10-10T14:32:30.789Z [INFO] Rolling back to previous version myapp:v1.2.2
2024-10-10T14:32:31.012Z [INFO] Rollback completed successfully`;

const V1_LOG_ANALYSIS = `Detailed Analysis Report:

- **Primary Issue Description**:
  The deployment of \`myapp:v1.2.3\` failed due to issues with pulling the image from the repository resulting in pods being unable to start.

- **Key Error Messages and Codes**:
  1. ERROR: \`Pod myapp-deployment-7b8c9d5f4-abc12 failed to start\`
  2. ERROR: \`Failed to pull image "myapp:v1.2.3": rpc error: code = Unknown desc = Error response from daemon: pull access denied for myapp, repository does not exist or may require 'docker login'\`
  3. ERROR: \`kubelet: Failed to pull image "myapp:v1.2.3": rpc error: code = Unknown desc = Error response from daemon: pull access denied\`
  4. ERROR: \`Deployment rollout failed: deployment "myapp-deployment" exceeded its progress deadline\`
  5. ERROR: \`ReplicaSet myapp-deployment-7b8c9d5f4 has 0 ready replicas out of 3 desired\`
  6. ERROR: \`Service myapp-service has no available endpoints\`
  7. CRITICAL: \`Production deployment failed - rollback initiated\`

- **Timeline of Failure Events**:
  1. **14:32:15** - Deployment started for \`myapp:v1.2.3\`.
  2. **14:32:16** - Pod creation initiated.
  3. **14:32:16** - Pod entered the Pending state.
  4. **14:32:17** - Pod failed to start due to image pull issues.
  5. **14:32:25** - Deployment rollout process exceeded its deadline.
  6. **14:32:26** - 0 out of 3 replicas were ready.
  7. **14:32:28** - Service \`myapp-service\` had no available endpoints.
  8. **14:32:29** - Failures led to rollback.

- **Root Cause Analysis**:
  The root cause of the failure was the inability to pull the image for the application \`myapp:v1.2.3\` from the container repository. This was due to pull access issues which possibly require authentication via \`docker login\`. This resulted in the pods failing to start and the entire deployment being unable to progress.

- **Affected Components**:
  1. Kubernetes Deployment: \`myapp-deployment\`
  2. ReplicaSet: \`myapp-deployment-7b8c9d5f4\`
  3. Service: \`myapp-service\``;

const V1_INVESTIGATION = `### Comprehensive Investigation Report

#### Similar Issues Found Online with References
1. **Docker Registry Pull Issues**:
   - How to Debug Docker Registry Pull Issues
     - URL: https://oneuptime.com/blog/post/2026-01-25-debug-docker-registry-pull-issues/view
     - Date: 2026-01-25

2. **Error Response from Daemon**: Pull Access Denied
   - Docker Forums Discussion
     - URL: https://forums.docker.com/t/docker-error-response-from-daemon-pull-access-denied/126237
     - Date: 2022-06-30

3. **Pull Access Denied on a Private Docker Repository**:
   - Stackoverflow Discussion
     - URL: https://stackoverflow.com/questions/72173723/failed-to-pull-image-rpc-error
     - Date: 2022-05-09

#### Official Documentation Links
1. **Troubleshoot Image Pulls in Google Kubernetes Engine (GKE)**:
   - Google Cloud Documentation
     - URL: https://cloud.google.com/kubernetes-engine/docs/troubleshooting/image-pulls
     - Date: 2025-08-29

#### Common Causes Ranked by Likelihood
1. **Authentication Issues**: Missing or incorrect credentials for accessing private repositories, necessitating a \`docker login\`.
2. **Repository Access Control**: Changed or incorrect permissions or access control settings on the repository.
3. **Network Issues**: Intermittent connectivity issues or outdated DNS settings potentially blocking the image pull access.

#### Community-Verified Solutions
1. **Authentication and Login**:
   - Ensure \`docker login\` is performed before deployment to allow access to private repositories.

2. **Checking Repository Permissions**:
   - Verify permissions of the Docker Registry to ensure the account has the read/pull access rights.

3. **Network and DNS Checks**:
   - Ensure there are no network policies or DNS issues blocking access to the Docker repository.

#### Best Practices to Prevent Similar Issues
1. **Regular Credential Updates**: Set a schedule to regularly update and validate credentials stored in Kubernetes secrets.
2. **Automated Authentication**: Implement automated authentication scripts as part of your CI/CD pipeline to ensure credentials are always up-to-date.
3. **Monitoring and Alerts**: Establish monitoring for deployment errors and setup alerts to proactively manage authentication issues.
4. **Access Reviews**: Conduct regular reviews of repository access permissions in collaboration with security policies.`;

const V1_SOLUTION = `1. **Step-by-Step Remediation Plan:**

   - **Authenticate to Docker Registry:**
     \`\`\`bash
     docker login my.registry.com
     \`\`\`

   - **Verify Image Availability:**
     \`\`\`bash
     docker search myapp
     \`\`\`

   - **Update Kubernetes Secrets:**
     \`\`\`bash
     kubectl create secret docker-registry regcred \\
     --docker-server=my.registry.com \\
     --docker-username=your_username \\
     --docker-password=your_password \\
     --docker-email=your_email@example.com
     \`\`\`

   - **Re-deploy Application:**
     \`\`\`bash
     kubectl set image deployment/myapp-deployment myapp=my.registry.com/myapp:v1.2.3
     kubectl rollout restart deployment/myapp-deployment
     \`\`\`

2. **Verification Steps:**

   - **Check Pods Status:**
     \`\`\`bash
     kubectl get pods -l app=myapp
     \`\`\`

   - **Check Deployment Status:**
     \`\`\`bash
     kubectl rollout status deployment/myapp-deployment
     \`\`\`

   - **Verify Service Endpoints:**
     \`\`\`bash
     kubectl get endpoints myapp-service
     \`\`\`

3. **Monitoring & Prevention Measures:**

   - **Credential Automation:** Implement CI/CD pipeline automation to handle \`docker login\` using environment variables or secrets stored securely.
   - **Regular Credential Validation:** Schedule regular credential updates in CI/CD configurations and Kubernetes secrets.
   - **Network & Access Monitoring:** Use monitoring tools like Prometheus and Grafana to track network health and repository access logs.
   - **Audit & Review Policy:** Conduct periodic reviews of access permissions and policy settings on your Docker Registry.

4. **Rollback Procedures:**

   - **Rollback to a Stable Deployment:**
     \`\`\`bash
     kubectl rollout undo deployment/myapp-deployment
     \`\`\`

   - **Verify Rollback:**
     \`\`\`bash
     kubectl get pods -o wide -l app=myapp
     \`\`\``;

const V2_LOG_ANALYSIS = `{
  "primary_issue": "Deployment failure of myapp-deployment",
  "root_cause": "Image pull error due to access denial, possibly requiring authentication or non-existent repository",
  "errors": [
    "Pod myapp-deployment-7b8c9d5f4-abc12 failed to start",
    "Failed to pull image \\"myapp:v1.2.3\\": pull access denied, repository does not exist or may require 'docker login'",
    "Pod myapp-deployment-7b8c9d5f4-abc12 status: ImagePullBackOff",
    "Deployment rollout failed: deployment \\"myapp-deployment\\" exceeded its progress deadline",
    "Service myapp-service has no available endpoints",
    "Production deployment failed - rollback initiated"
  ],
  "affected_components": [
    "Pod myapp-deployment-7b8c9d5f4-abc12",
    "Image myapp:v1.2.3",
    "Deployment myapp-deployment",
    "Service myapp-service"
  ],
  "timeline": [
    "[2024-01-15 14:32:15.123] Starting deployment of myapp-deployment",
    "[2024-01-15 14:32:16.567] Pod myapp-deployment-7b8c9d5f4-abc12 in Pending state",
    "[2024-01-15 14:32:17.890] Pod myapp-deployment-7b8c9d5f4-abc12 failed to start",
    "[2024-01-15 14:32:18.123] Failed to pull image \\"myapp:v1.2.3\\": pull access denied",
    "[2024-01-15 14:32:18.456] Pod myapp-deployment-7b8c9d5f4-abc12 status: ImagePullBackOff",
    "[2024-01-15 14:32:25.901] Deployment rollout failed",
    "[2024-01-15 14:32:26.789] Service myapp-service has no available endpoints",
    "[2024-01-15 14:32:29.456] Production deployment failed - rollback initiated"
  ]
}`;

const V2_INVESTIGATION = `**Comprehensive Investigation Report**

---

**Primary Issue:** Deployment failure of myapp-deployment

**Root Cause:** Image pull error due to access denial, possibly requiring authentication or non-existent repository

**Errors Encountered:**
- Pod \`myapp-deployment-7b8c9d5f4-abc12\` failed to start
- Failed to pull image "myapp:v1.2.3": pull access denied, repository does not exist or may require 'docker login'
- Pod \`myapp-deployment-7b8c9d5f4-abc12\` status: ImagePullBackOff
- Deployment rollout failed: deployment "myapp-deployment" exceeded its progress deadline
- Service \`myapp-service\` has no available endpoints
- Production deployment failed - rollback initiated

**Affected Components:**
- Pod \`myapp-deployment-7b8c9d5f4-abc12\`
- Image \`myapp:v1.2.3\`
- Deployment \`myapp-deployment\`
- Service \`myapp-service\`

**Common Causes Ranked by Likelihood:**
1. **Authentication Issues:** The Docker image repository requires authentication, and the configured Kubernetes credentials may not have been provided or are incorrect.
2. **Repository Non-existence:** The specified Docker repository may not exist, or there is a typo in the image name or tag.
3. **Access Permission:** The repository is private, and the necessary access permissions have not been granted.
4. **Network Issues:** Temporary network connectivity issues that prevented communication with the Docker registry.

**Known Solutions and Best Practices:**
1. **Authenticate Docker Registry Access:** Ensure a Kubernetes secret containing Docker registry credentials is correctly referenced. Use \`kubectl create secret docker-registry\` command.
2. **Verify Repository Existence:** Double-check the repository URL and tag for typos.
3. **Permissions Setting:** If using a private repository, ensure that access is granted to the necessary users or service accounts.
4. **Implement Rollback Strategy:** Use Kubernetes' built-in rollback functionality.

**Recommended Fixes and Workarounds:**
- Check and Reconfigure Image Pull Secret
- Verify and Correct Image Reference
- Conduct Network Diagnostics
- Review Deployment Manifests`;

const V2_SOLUTION = `### Complete Solution for Deployment Failure of \`myapp-deployment\`

#### Step 1: Verify and Authenticate Docker Registry Access

1. **Verify Docker Credentials in Kubernetes**
   \`\`\`sh
   kubectl get secret docker-registry-secret-name -n your-namespace -o yaml
   \`\`\`

2. **Create or Update Kubernetes Secret for Docker Registry**
   \`\`\`sh
   kubectl create secret docker-registry your-secret-name \\
     --docker-server=<DOCKER_REGISTRY_SERVER> \\
     --docker-username=<YOUR_USERNAME> \\
     --docker-password=<YOUR_PASSWORD> \\
     --docker-email=<YOUR_EMAIL> \\
     --namespace=your-namespace
   \`\`\`

3. **Update Deployment with Image Pull Secrets**
   \`\`\`yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: myapp-deployment
     namespace: your-namespace
   spec:
     template:
       spec:
         imagePullSecrets:
         - name: your-secret-name
   \`\`\`

#### Step 2: Verify Repository Existence
- Ensure there are no typos in the image name and tag \`myapp:v1.2.3\`.
- Log into the Docker registry and check if the specified image exists.

#### Step 3: Permissions and Network Check
- Ensure the Docker user has pull access to the repository.
- Test connectivity: \`curl -v https://<DOCKER_REGISTRY_SERVER>\`

#### Step 4: Reattempt Deployment
\`\`\`sh
kubectl rollout restart deployment/myapp-deployment
kubectl get pods -n your-namespace -w
\`\`\`

#### Verification Steps
\`\`\`sh
kubectl get pods -n your-namespace
kubectl describe pod <your-pod-name> -n your-namespace
kubectl logs <your-pod-name> -n your-namespace
\`\`\`

#### Monitoring and Prevention Measures
- Set up monitoring using Prometheus and Grafana
- Integrate CI/CD pipeline validation for image existence and credentials
- Conduct regular audits of access permissions`;

function makeLog(version: string, agentName: string, agentNum: number, tag: string): LogLine[] {
  const prefix = version.toUpperCase();
  return [
    { tag: "BOOT", text: `[${prefix}] Initializing ${agentName} (Agent ${agentNum}/3)` },
    { tag: "INFO", text: `[${prefix}] ${agentName} — processing input data` },
    { tag: "PROCESS", text: `[${prefix}] ${agentName} — ${tag}` },
    { tag: "OK", text: `[${prefix}] ${agentName} — output ready` },
  ];
}

export const demoData: VersionData = {
  label: "Multi-Agent Pipeline — Structured Output + Guardrails",
  agentOutputs: [
    {
      agent: "Log Analyzer",
      output: V2_LOG_ANALYSIS,
      tools: [
        {
          tool: "FileReadTool",
          input: "file_path: ./dummy_logs/kubernetes_deployment_error.log",
          output: "Read 21 lines (1.4 KB) — parsed into LogAnalysisReport (Pydantic)",
        },
      ],
    },
    {
      agent: "Issue Investigator",
      output: V2_INVESTIGATION,
      tools: [
        {
          tool: "EXASearchTool",
          input: 'query: "docker pull access denied kubernetes deployment failure remediation"',
          output: "Found 4 results — Docker docs, K8s secrets guide, community fixes",
        },
      ],
      context: ["Log Analyzer structured output (LogAnalysisReport JSON)"],
    },
    {
      agent: "Solution Specialist",
      output: V2_SOLUTION,
      tools: [],
      context: ["Log Analyzer output (LogAnalysisReport JSON)", "Issue Investigator output (investigation_report.md)"],
    },
  ],
  log: [
    { tag: "BOOT", text: "Initializing DevOps Analysis Crew (3 agents)" },
    { tag: "INFO", text: "Mode: Sequential pipeline, Pydantic structured output" },
    { tag: "INFO", text: "LLM: openai/gpt-4o via OpenRouter (RPM: 10)" },
    { tag: "INFO", text: "Guardrails: LogAnalysisReport schema enforced" },
    ...makeLog("crew", "Log Analyzer", 1, "Parsing log into structured JSON (Pydantic)"),
    ...makeLog("crew", "Issue Investigator", 2, "Cross-referencing with online resources"),
    ...makeLog("crew", "Solution Specialist", 3, "Building step-by-step remediation with YAML examples"),
    { tag: "SUCCESS", text: "Pipeline complete — 3/3 agents finished" },
  ],
};

export const project: ProjectDef = {
  slug: "devops-log-analyzer",
  tier: "intermediate",
  number: "00",
  title: "DevOps Log Analyzer",
  codename: "DEVOPS_ANALYSIS",
  blurb:
    "A 3-agent sequential CrewAI pipeline that analyzes Kubernetes deployment error logs, investigates root causes with online research, and generates actionable remediation plans.",
  status: "stable",
  tags: ["Py_3.12", "CrewAI", "OpenRouter", "EXA_Search", "FileReadTool"],
  pipeline: ["Log Analyzer", "Issue Investigator", "Solution Specialist"],
  inputSchema: [
    {
      key: "log_file",
      label: "K8S_ERROR_LOG",
      kind: "textarea",
      rows: 12,
      placeholder: "Paste Kubernetes deployment error logs here...",
    },
  ],
  outputType: "markdown",
  fixture: {
    input: { log_file: DUMMY_LOG },
    output: V2_SOLUTION,
    log: demoData.log,
  },
  endpoint: "/api/intermediate/devops-log-analyzer",
};
