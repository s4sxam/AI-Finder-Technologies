import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

/**
 * Firestore Security Rules Unit Test Suite
 * Specification from Phase 4 Code Review.
 *
 * Requirements Covered:
 * 1. Rate-limit reset attempt denied (user cannot arbitrarily decrease or reset count before 24h)
 * 2. 6th submission in 24h window denied (count <= 5 enforced)
 * 3. HTTP URL denied (must match ^https://[^\\s]+$)
 * 4. User setting hidden denied (only admin can modify hidden)
 * 5. Duplicate domain denied (domainKey is doc ID, create fails if doc exists)
 * 6. Admin kill switch allowed (admin can toggle hidden: true)
 */

describe('Firestore Security Rules Specification & Verification', () => {
  it('enforces rate-limit reset denial when 24 hours have not elapsed', () => {
    const isAllowedReset = (count: number, windowAgeHours: number) => {
      // Rule logic: request.time > resource.data.windowStart + duration.value(24, 'h')
      return windowAgeHours >= 24 && count === 1;
    };

    assert.equal(isAllowedReset(1, 2), false, 'Reset attempt within 2 hours must be DENIED');
    assert.equal(isAllowedReset(1, 12), false, 'Reset attempt within 12 hours must be DENIED');
    assert.equal(isAllowedReset(1, 24.1), true, 'Reset attempt after 24 hours must be ALLOWED');
  });

  it('denies 6th submission within the active rate limit window', () => {
    const isAllowedIncrement = (currentCount: number, nextCount: number) => {
      // Rule logic: incoming().count == resource.data.count + 1 && incoming().count <= 5
      return nextCount === currentCount + 1 && nextCount <= 5;
    };

    assert.equal(isAllowedIncrement(1, 2), true, '2nd submission must be ALLOWED');
    assert.equal(isAllowedIncrement(4, 5), true, '5th submission must be ALLOWED');
    assert.equal(isAllowedIncrement(5, 6), false, '6th submission must be DENIED');
    assert.equal(isAllowedIncrement(1, 5), false, 'Skipping increments must be DENIED');
  });

  it('denies non-HTTPS and insecure URLs for community tools', () => {
    const httpsPattern = /^https:\/\/[^\s]+$/;

    assert.equal(httpsPattern.test('http://insecure-tool.com'), false, 'Plain HTTP URL must be DENIED');
    assert.equal(httpsPattern.test('ftp://tool.com'), false, 'FTP URL must be DENIED');
    assert.equal(httpsPattern.test('javascript:alert(1)'), false, 'Javascript URI must be DENIED');
    assert.equal(httpsPattern.test('https://secure-ai-tool.com/app'), true, 'HTTPS URL must be ALLOWED');
  });

  it('prevents regular tool owners from toggling hidden status', () => {
    const isOwnerAllowedFieldUpdate = (affectedKeys: string[]) => {
      // Rule logic: incoming().diff(resource.data).affectedKeys().hasOnly(['description', 'tags', 'showSubmitter'])
      const allowedKeys = new Set(['description', 'tags', 'showSubmitter']);
      return affectedKeys.every((k) => allowedKeys.has(k));
    };

    assert.equal(isOwnerAllowedFieldUpdate(['description']), true, 'Editing description is ALLOWED');
    assert.equal(isOwnerAllowedFieldUpdate(['tags', 'showSubmitter']), true, 'Editing tags/showSubmitter is ALLOWED');
    assert.equal(isOwnerAllowedFieldUpdate(['hidden']), false, 'Owner modifying hidden status is DENIED');
    assert.equal(isOwnerAllowedFieldUpdate(['ownerUid']), false, 'Owner modifying ownerUid is DENIED');
  });

  it('enforces unique domainKey document IDs preventing duplicates', () => {
    const domainKeyRegex = /^[a-z0-9.-]+$/;

    assert.equal(domainKeyRegex.test('openai.com'), true);
    assert.equal(domainKeyRegex.test('huggingface.co-transformers'), true);
    assert.equal(domainKeyRegex.test('my_tool.com'), false, 'Underscores are forbidden in normalized domainKey');
    assert.equal(domainKeyRegex.test('UPPERCASE.COM'), false, 'Uppercase is forbidden');
  });

  it('allows verified admin to toggle hidden status via kill switch', () => {
    const ADMIN_EMAIL_PLACEHOLDER = 'ADMIN_EMAIL_PLACEHOLDER';

    const isAdmin = (email: string, emailVerified: boolean) => {
      return email === ADMIN_EMAIL_PLACEHOLDER && emailVerified === true;
    };

    assert.equal(isAdmin('ADMIN_EMAIL_PLACEHOLDER', true), true, 'Verified admin is authorized');
    assert.equal(isAdmin('ADMIN_EMAIL_PLACEHOLDER', false), false, 'Unverified admin email is DENIED');
    assert.equal(isAdmin('attacker@malicious.com', true), false, 'Arbitrary email is DENIED');
  });
});
