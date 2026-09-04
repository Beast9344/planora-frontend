'use client';

import { useEffect, useLayoutEffect } from 'react';

/**
 * useLayoutEffect that does not warn during server rendering.
 *
 * The motion primitives need to touch the DOM *before* the browser paints —
 * otherwise a section would flash fully visible and then jump back to its
 * hidden start state. On the server neither hook ever runs, so falling back to
 * useEffect there is purely to silence React's warning.
 */
export const useIsoLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;
