import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'record',
    loadComponent: () => import('./pages/record/record.component').then(m => m.RecordComponent),
    canActivate: [authGuard]
  },
  {
    path: 'health',
    loadComponent: () => import('./pages/health-check/health-check.component').then(m => m.HealthCheckComponent)
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
