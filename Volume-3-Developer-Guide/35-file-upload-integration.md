# How to Integrate File Upload

> **Volume:** 3 | **Chapter ID:** v3-35 | **Status:** reviewed

## What You Will Accomplish

You will integrate file upload for resource attachments using the platform object storage service.

## Prerequisites

- [Project Setup](01-project-setup.md) completed
- [Development Environment](02-development-environment.md) configured
- [Create New Service](04-create-new-service.md) completed
- Object storage service available

## Steps

### Step 1: Request upload URL

`POST /catalog/v1/resources/{id}/attachments/upload-url` — returns presigned URL.

### Step 2: Client uploads directly to storage

BFF/frontend uploads to presigned URL (not through service).

### Step 3: Confirm upload

`POST /catalog/v1/resources/{id}/attachments/confirm` — register metadata.

### Step 4: Validate file type and size

Max 10MB; allowed types: pdf, png, jpg.

**Expected result:** Attachment stored in object storage; metadata in catalog DB.

## Verification

- [ ] All tests pass
- [ ] Code review checklist completed
- [ ] Presigned URL expires in 15 minutes
- [ ] File type validation enforced

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Config not loaded | Wrong env file | Check .env and env var names |
| Service won't start | Missing dependency | Verify docker compose services running |
| 500 on startup | Invalid config value | Check logs for validation errors |

## Reference

- [Coding Standards](../Volume-1-Foundation/25-coding-standards.md)
- [API Standards](../Volume-1-Foundation/18-api-standards.md)

## Related Chapters

- [Previous: Queue Processing Guide](34-queue-processing-guide.md)
- [Next: Import Data Guide](36-import-data-guide.md)
- [EPB Glossary](../docs/GLOSSARY.md)


---

*Enterprise Platform Blueprint — Volume 3*
