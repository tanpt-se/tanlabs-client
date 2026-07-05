'use client';

import { Suspense } from 'react';
import { Outlet, useNavigation } from 'react-router-dom';

import { RouteContentFallback } from './route-content-fallback';
import { RouteNavigationBar } from './route-navigation-bar';

export function RouteTransitionOutlet() {
  const navigation = useNavigation();
  const isNavigating = navigation.state === 'loading';

  return (
    <>
      {isNavigating ? <RouteNavigationBar /> : null}
      {isNavigating ? (
        <RouteContentFallback />
      ) : (
        <Suspense fallback={<RouteContentFallback />}>
          <Outlet />
        </Suspense>
      )}
    </>
  );
}
