import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  User,
  MapPin,
  Briefcase,
  Upload,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  CreditCard,
  GraduationCap
} from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { UploadBox } from '../components/shared/UploadBox';
import { IDCardPreview } from '../components/id-card/IDCardPreview';
import { useCards } from '../context/CardContext';
import { useToast } from '../context/ToastContext';
import { DEPARTMENTS } from '../utils/theme';

export const CreateCardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addCard, updateCard } = useCards();
  const { addToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cardToEdit = location.state?.cardToEdit;
  const initialTemplate = location.state?.selectedTemplate || 'modern';

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    trigger,
    formState: { errors }
  } = useForm({
    defaultValues: {
      cardType: cardToEdit?.cardType || (cardToEdit?.college ? 'Student' : 'Employee'),
      fullName: cardToEdit?.fullName || '',
      fatherName: cardToEdit?.fatherName || '',
      motherName: cardToEdit?.motherName || '',
      dob: cardToEdit?.dob || '',
      gender: cardToEdit?.gender || 'Male',
      bloodGroup: cardToEdit?.bloodGroup || 'O+',
      phone: cardToEdit?.phone || cardToEdit?.mobile || '',
      email: cardToEdit?.email || '',
      address: cardToEdit?.address || '',
      city: cardToEdit?.city || '',
      state: cardToEdit?.state || '',
      pincode: cardToEdit?.pincode || '',
      country: cardToEdit?.country || 'USA',
      // Employee
      companyName: cardToEdit?.companyName || cardToEdit?.company || '',
      department: cardToEdit?.department || 'Engineering',
      designation: cardToEdit?.designation || '',
      employeeId: cardToEdit?.employeeId || '',
      joiningDate: cardToEdit?.joiningDate || '',
      // Student
      college: cardToEdit?.college || '',
      course: cardToEdit?.course || '',
      branch: cardToEdit?.branch || '',
      semester: cardToEdit?.semester || '',
      rollNumber: cardToEdit?.rollNumber || '',
      // Uploads
      photoUrl: cardToEdit?.photoUrl || '',
      photoFile: null,
      signatureUrl: cardToEdit?.signatureUrl || '',
      signatureFile: null,
      logoUrl: cardToEdit?.logoUrl || '',
      logoFile: null
    }
  });

  useEffect(() => {
    if (cardToEdit) {
      reset({
        cardType: cardToEdit.cardType || (cardToEdit.college ? 'Student' : 'Employee'),
        fullName: cardToEdit.fullName || '',
        fatherName: cardToEdit.fatherName || '',
        motherName: cardToEdit.motherName || '',
        dob: cardToEdit.dob || '',
        gender: cardToEdit.gender || 'Male',
        bloodGroup: cardToEdit.bloodGroup || 'O+',
        phone: cardToEdit.phone || cardToEdit.mobile || '',
        email: cardToEdit.email || '',
        address: cardToEdit.address || '',
        city: cardToEdit.city || '',
        state: cardToEdit.state || '',
        pincode: cardToEdit.pincode || '',
        country: cardToEdit.country || 'USA',
        companyName: cardToEdit.companyName || cardToEdit.company || '',
        department: cardToEdit.department || 'Engineering',
        designation: cardToEdit.designation || '',
        employeeId: cardToEdit.employeeId || '',
        joiningDate: cardToEdit.joiningDate || '',
        college: cardToEdit.college || '',
        course: cardToEdit.course || '',
        branch: cardToEdit.branch || '',
        semester: cardToEdit.semester || '',
        rollNumber: cardToEdit.rollNumber || '',
        photoUrl: cardToEdit.photoUrl || '',
        signatureUrl: cardToEdit.signatureUrl || '',
        logoUrl: cardToEdit.logoUrl || ''
      });
    }
  }, [cardToEdit, reset]);

  const formData = watch();

  const steps = [
    { id: 1, title: 'Personal Info', icon: User },
    { id: 2, title: 'Address Details', icon: MapPin },
    { id: 3, title: formData.cardType === 'Student' ? 'Academic Details' : 'Professional Details', icon: formData.cardType === 'Student' ? GraduationCap : Briefcase },
    { id: 4, title: 'File Uploads', icon: Upload },
    { id: 5, title: 'Review & Submit', icon: CheckCircle2 }
  ];

  const handleNextStep = async () => {
    let fieldsToValidate = [];
    if (currentStep === 1) {
      fieldsToValidate = ['fullName', 'dob', 'gender', 'bloodGroup', 'phone', 'email'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['address', 'city', 'state', 'pincode', 'country'];
    } else if (currentStep === 3) {
      if (formData.cardType === 'Student') {
        fieldsToValidate = ['college', 'course', 'branch', 'semester', 'rollNumber'];
      } else {
        fieldsToValidate = ['companyName', 'department', 'designation', 'employeeId'];
      }
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    } else {
      addToast('Please fill all required fields correctly', 'warning');
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = new FormData();
      payload.append('cardType', data.cardType || 'Employee');
      payload.append('fullName', data.fullName);
      if (data.fatherName) payload.append('fatherName', data.fatherName);
      if (data.motherName) payload.append('motherName', data.motherName);
      payload.append('dob', data.dob);
      payload.append('gender', data.gender || 'Male');
      payload.append('bloodGroup', data.bloodGroup || 'O+');
      payload.append('mobile', data.phone);
      payload.append('email', data.email);
      payload.append('address', data.address);
      payload.append('city', data.city);
      payload.append('state', data.state);
      payload.append('country', data.country || 'USA');
      payload.append('pincode', data.pincode);

      if (data.cardType === 'Student') {
        payload.append('college', data.college);
        payload.append('course', data.course);
        payload.append('branch', data.branch);
        payload.append('semester', data.semester);
        payload.append('rollNumber', data.rollNumber);
        payload.append('employeeId', data.rollNumber);
        payload.append('department', data.course || 'Student');
        payload.append('designation', data.branch || 'Student');
        payload.append('company', data.college);
      } else {
        payload.append('company', data.companyName);
        payload.append('department', data.department);
        payload.append('designation', data.designation);
        payload.append('employeeId', data.employeeId);
      }

      if (data.joiningDate) payload.append('joiningDate', data.joiningDate);

      if (data.photoFile) payload.append('photo', data.photoFile);
      if (data.signatureFile) payload.append('signature', data.signatureFile);
      if (data.logoFile) payload.append('companyLogo', data.logoFile);

      if (cardToEdit && (cardToEdit.id || cardToEdit._id)) {
        const cardId = cardToEdit.id || cardToEdit._id;
        await updateCard(cardId, payload);
        addToast(`Updated ID Card for ${data.fullName}!`, 'success');
      } else {
        await addCard(payload);
        addToast(`Created ID Card for ${data.fullName}!`, 'success');
      }
      navigate('/dashboard/preview');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to save ID Card';
      addToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={[{ label: 'Create ID Card' }]} />

      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Create ID Card Generator Wizard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete the 5-step wizard to issue high-resolution credentials.
          </p>
        </div>
      </div>

      {/* Wizard Step Indicator */}
      <Card className="p-4 sm:p-6 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[600px] relative">
          <div className="absolute top-1/2 left-6 right-6 h-1 bg-slate-200 -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 left-6 h-1 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 90}%` }}
          />

          {steps.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 ${
                    isCompleted
                      ? 'bg-blue-600 text-white shadow-md'
                      : isCurrent
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-md'
                      : 'bg-white text-slate-400 border-2 border-slate-200'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <step.icon className="w-4 h-4" />}
                </div>
                <span
                  className={`text-xs font-semibold ${
                    isCurrent ? 'text-blue-600' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                  }`}
                >
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Main Wizard Form Container */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="p-6 sm:p-8">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Step 1: Personal Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <Input
                  label="Full Name *"
                  placeholder="e.g. Sarah Jenkins"
                  error={errors.fullName?.message}
                  {...register('fullName', { required: 'Full Name is required' })}
                />
                <Input
                  label="Father Name"
                  placeholder="e.g. Robert Jenkins"
                  {...register('fatherName')}
                />
                <Input
                  label="Mother Name"
                  placeholder="e.g. Laura Jenkins"
                  {...register('motherName')}
                />
                <Input
                  label="Date of Birth *"
                  type="date"
                  error={errors.dob?.message}
                  {...register('dob', { required: 'DOB is required' })}
                />
                <Select
                  label="Gender *"
                  options={['Male', 'Female', 'Other']}
                  {...register('gender')}
                />
                <Select
                  label="Blood Group *"
                  options={['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']}
                  {...register('bloodGroup')}
                />
                <Input
                  label="Phone Number *"
                  placeholder="e.g. +1 (555) 345-6789"
                  error={errors.phone?.message}
                  {...register('phone', { required: 'Phone is required' })}
                />
                <Input
                  label="Email Address *"
                  type="email"
                  placeholder="e.g. sarah@company.com"
                  error={errors.email?.message}
                  {...register('email', { required: 'Email is required' })}
                />
              </div>
            </div>
          )}

          {/* Step 2: Address */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Step 2: Residential Address
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <Textarea
                    label="Street Address *"
                    placeholder="e.g. 742 Evergreen Terrace, Suite 400"
                    error={errors.address?.message}
                    {...register('address', { required: 'Address is required' })}
                  />
                </div>
                <Input
                  label="City *"
                  placeholder="e.g. San Francisco"
                  error={errors.city?.message}
                  {...register('city', { required: 'City is required' })}
                />
                <Input
                  label="State / Province *"
                  placeholder="e.g. California"
                  error={errors.state?.message}
                  {...register('state', { required: 'State is required' })}
                />
                <Input
                  label="Pincode / ZIP *"
                  placeholder="e.g. 94107"
                  error={errors.pincode?.message}
                  {...register('pincode', { required: 'Pincode is required' })}
                />
                <Input
                  label="Country *"
                  placeholder="e.g. USA"
                  error={errors.country?.message}
                  {...register('country', { required: 'Country is required' })}
                />
              </div>
            </div>
          )}

          {/* Step 3: Professional / Student Details */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-slate-900">
                  Step 3: {formData.cardType === 'Student' ? 'Academic Details' : 'Professional Details'}
                </h3>

                {/* Card Type Selector */}
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setValue('cardType', 'Employee')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                      formData.cardType === 'Employee'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Employee ID
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue('cardType', 'Student')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                      formData.cardType === 'Student'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Student ID
                  </button>
                </div>
              </div>

              {formData.cardType === 'Employee' ? (
                /* Employee Fields */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  <Input
                    label="Company Name *"
                    placeholder="e.g. Apex Innovations Inc."
                    error={errors.companyName?.message}
                    {...register('companyName', { required: 'Company name is required' })}
                  />
                  <Select
                    label="Department *"
                    options={DEPARTMENTS}
                    {...register('department')}
                  />
                  <Input
                    label="Designation *"
                    placeholder="e.g. Senior Lead Architect"
                    error={errors.designation?.message}
                    {...register('designation', { required: 'Designation is required' })}
                  />
                  <Input
                    label="Employee ID Code *"
                    placeholder="e.g. APX-9482"
                    error={errors.employeeId?.message}
                    {...register('employeeId', { required: 'Employee ID is required' })}
                  />
                  <Input
                    label="Joining Date"
                    type="date"
                    {...register('joiningDate')}
                  />
                </div>
              ) : (
                /* Student Fields */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  <Input
                    label="College / University Name *"
                    placeholder="e.g. Stanford University"
                    error={errors.college?.message}
                    {...register('college', { required: 'College name is required' })}
                  />
                  <Input
                    label="Course / Program *"
                    placeholder="e.g. B.Tech / B.Sc / MBA"
                    error={errors.course?.message}
                    {...register('course', { required: 'Course is required' })}
                  />
                  <Input
                    label="Branch / Discipline *"
                    placeholder="e.g. Computer Science & Eng"
                    error={errors.branch?.message}
                    {...register('branch', { required: 'Branch is required' })}
                  />
                  <Input
                    label="Semester / Year *"
                    placeholder="e.g. 6th Semester / 3rd Year"
                    error={errors.semester?.message}
                    {...register('semester', { required: 'Semester is required' })}
                  />
                  <Input
                    label="Roll Number / Student ID *"
                    placeholder="e.g. STU-2026-8890"
                    error={errors.rollNumber?.message}
                    {...register('rollNumber', { required: 'Roll Number is required' })}
                  />
                  <Input
                    label="Admission / Joining Date"
                    type="date"
                    {...register('joiningDate')}
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 4: Uploads */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Step 4: Image & Asset Uploads
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <UploadBox
                  label={formData.cardType === 'Student' ? 'Student Photo' : 'Employee Photo'}
                  value={formData.photoUrl}
                  onChange={(previewUrl, file) => {
                    setValue('photoUrl', previewUrl);
                    setValue('photoFile', file);
                  }}
                  helperText="Upload clear headshot photo"
                />
                <UploadBox
                  label="Authorized Signature"
                  value={formData.signatureUrl}
                  onChange={(previewUrl, file) => {
                    setValue('signatureUrl', previewUrl);
                    setValue('signatureFile', file);
                  }}
                  helperText="Transparent PNG signature"
                />
                <UploadBox
                  label={formData.cardType === 'Student' ? 'College Logo' : 'Company Logo'}
                  value={formData.logoUrl}
                  onChange={(previewUrl, file) => {
                    setValue('logoUrl', previewUrl);
                    setValue('logoFile', file);
                  }}
                  helperText="Square branding logo"
                />
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div className="space-y-8 animate-in fade-in">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Step 5: Review & Live Card Preview
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Live Card Preview Box */}
                <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                    Live Printable Preview
                  </span>
                  <IDCardPreview card={formData} templateId="modern" isLandscape={true} />
                </div>

                {/* Summary Table */}
                <div className="lg:col-span-6 space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Summary Verification ({formData.cardType || 'Employee'})
                  </h4>
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl p-4 bg-white text-xs space-y-2">
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Name:</span>
                      <span className="font-bold text-slate-900">{formData.fullName || '—'}</span>
                    </div>
                    {formData.cardType === 'Student' ? (
                      <>
                        <div className="flex justify-between py-1">
                          <span className="text-slate-500">Roll Number:</span>
                          <span className="font-mono font-bold text-blue-600">{formData.rollNumber || '—'}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-slate-500">College:</span>
                          <span className="font-semibold text-slate-800">{formData.college || '—'}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-slate-500">Course / Branch:</span>
                          <span className="font-semibold text-slate-800">{formData.course} ({formData.branch})</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-slate-500">Semester:</span>
                          <span className="font-semibold text-slate-800">{formData.semester || '—'}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between py-1">
                          <span className="text-slate-500">Employee ID:</span>
                          <span className="font-mono font-bold text-blue-600">{formData.employeeId || '—'}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-slate-500">Company:</span>
                          <span className="font-semibold text-slate-800">{formData.companyName || '—'}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-slate-500">Department:</span>
                          <span className="font-semibold text-slate-800">{formData.department || '—'}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-slate-500">Designation:</span>
                          <span className="font-semibold text-slate-800">{formData.designation || '—'}</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Phone:</span>
                      <span className="font-semibold text-slate-800">{formData.phone || '—'}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Blood Group:</span>
                      <span className="font-semibold text-red-600">{formData.bloodGroup}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevStep}
              disabled={currentStep === 1 || isSubmitting}
              icon={ChevronLeft}
            >
              Previous
            </Button>

            {currentStep < 5 ? (
              <Button
                type="button"
                variant="primary"
                onClick={handleNextStep}
                className="flex items-center gap-2"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                icon={CreditCard}
                isLoading={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Generate & Save ID Card
              </Button>
            )}
          </div>
        </Card>
      </form>
    </div>
  );
};
