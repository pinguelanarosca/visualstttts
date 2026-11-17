/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MotionConfig } from 'motion/react';
import { FluidBackground } from './components/FluidBackground';
import { ShowcaseShell } from './components/ShowcaseShell';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <FluidBackground />
      <ShowcaseShell />
    </MotionConfig>
  );
}
