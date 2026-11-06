// Runs before every test file
import '@testing-library/jest-dom/vitest'; // Adds matchers like toBeInTheDocument()
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Remove whatever the last test rendered, so each test starts with an empty page
afterEach(cleanup);
