'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { EmployeeForm } from '@/components/employees/EmployeeForm';

export default function NewEmployeePage() {
  return (
    <AppLayout allowedRoles={['admin']}>
      <EmployeeForm />
    </AppLayout>
  );
}
