'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { EmployeeForm } from '@/components/employees/EmployeeForm';

export default function EditEmployeePage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <AppLayout allowedRoles={['admin']}>
      <EmployeeForm employeeId={id} />
    </AppLayout>
  );
}
