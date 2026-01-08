"use client";

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import { AuthProvider } from './contexts/AuthContext';
import { MainRoutes } from './MainRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <MainRoutes />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
