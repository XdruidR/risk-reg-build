import { describe, it, expect } from 'vitest';
import { getPaths } from '../src/main/paths';

describe('getPaths', () => {
  it('returns expected paths', () => {
    const mockApp = {
      getPath: () => '/tmp/test-userData',
    };
    const p = getPaths(mockApp);
    expect(p.userDataRoot).toMatch(/ai-risk-register$/);
    expect(p.dataDir).toContain('/tmp/test-userData');
    expect(p.csvPath).toContain('risk_register.csv');
  });
});
