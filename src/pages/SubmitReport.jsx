import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Upload, X, MapPin, Users, Clock, Tag, Send, CheckCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '../contexts/AuthContext';

// Initialize Supabase client
const supabase = createClient(
  'https://hidhugwmgvdsefjemurn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpZGh1Z3dtZ3Zkc2VmamVtdXJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MTg5NTMsImV4cCI6MjA2ODQ5NDk1M30.81VK7rbvbOhgAQTh-6GfSpFvyBCjPqX-xhdTyylr_Iw'
);

const SubmitReport = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    urgency: '',
    location: '',
    description: '',
    supportType: '',
    skills: [],
    timeCommitment: '',
    resources: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    files: [],
    tags: []
  });
  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const totalSteps = 4;

  const categories = [
    { value: 'medical', label: '🏥 Medical Support', description: 'Healthcare, medical supplies, emergency care' },
    { value: 'food', label: '🍽️ Food & Nutrition', description: 'Food distribution, meal preparation, nutrition' },
    { value: 'shelter', label: '🏠 Shelter & Housing', description: 'Emergency housing, temporary shelter setup' },
    { value: 'transportation', label: '🚗 Transportation', description: 'Vehicle support, logistics, delivery' },
    { value: 'education', label: '📚 Education', description: 'Tutoring, training, educational resources' },
    { value: 'technology', label: '💻 Technology', description: 'IT support, digital literacy, equipment' },
    { value: 'coordination', label: '📋 Coordination', description: 'Project management, volunteer coordination' },
    { value: 'other', label: '🤝 Other Support', description: 'Other types of community support' }
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low', description: 'Can wait several days', color: 'green' },
    { value: 'medium', label: 'Medium', description: 'Needed within 1-2 days', color: 'yellow' },
    { value: 'high', label: 'High', description: 'Urgent - needed today', color: 'red' }
  ];

  const supportTypes = [
    { value: 'volunteer', label: 'Volunteer Time', icon: <Users className="h-5 w-5" /> },
    { value: 'skills', label: 'Professional Skills', icon: <Tag className="h-5 w-5" /> },
    { value: 'resources', label: 'Physical Resources', icon: <Upload className="h-5 w-5" /> },
    { value: 'funding', label: 'Financial Support', icon: <Clock className="h-5 w-5" /> }
  ];

  const skillOptions = [
    'Medical/Healthcare', 'Food Service', 'Construction', 'Transportation',
    'Translation', 'Childcare', 'Technology/IT', 'Legal',
    'Project Management', 'Communication', 'Education', 'Other'
  ];

  const timeCommitments = [
    { value: 'few-hours', label: 'A few hours' },
    { value: 'half-day', label: 'Half day (4 hours)' },
    { value: 'full-day', label: 'Full day (8 hours)' },
    { value: 'multiple-days', label: 'Multiple days' },
    { value: 'ongoing', label: 'Ongoing support' }
  ];

  const tagSuggestions = [
    'urgent', 'family-friendly', 'seniors', 'children', 'disabilities',
    'remote-possible', 'night-shift', 'weekend', 'multilingual', 'experienced-needed'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSkillToggle = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleTagToggle = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const newFiles = Array.from(files).slice(0, 5 - formData.files.length);
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...newFiles]
    }));
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    switch (step) {
      case 1:
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.urgency) newErrors.urgency = 'Urgency level is required';
        if (!formData.location.trim()) newErrors.location = 'Location is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        break;
      case 2:
        if (!formData.supportType) newErrors.supportType = 'Support type is required';
        if (formData.supportType === 'skills' && formData.skills.length === 0) {
          newErrors.skills = 'Please select at least one skill';
        }
        if (formData.supportType === 'volunteer' && !formData.timeCommitment) {
          newErrors.timeCommitment = 'Time commitment is required';
        }
        break;
      case 3:
        if (!formData.contactName.trim()) newErrors.contactName = 'Contact name is required';
        if (!formData.contactEmail.trim()) {
          newErrors.contactEmail = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
          newErrors.contactEmail = 'Please enter a valid email';
        }
        break;
    }
    return newErrors;
  };

  const nextStep = () => {
    const newErrors = validateStep(currentStep);
    if (Object.keys(newErrors).length === 0) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    } else {
      setErrors(newErrors);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

 const handleSubmit = async () => {
  // Validate all fields before submitting
  const newErrors = validateStep(currentStep);
  if (Object.keys(newErrors).length === 0) {
    if (!user) {
      alert('You must be logged in to submit a support offer.');
      return;
    }
    setIsSubmitting(true);
    try {
      // Upload files to Supabase Storage
      let fileUrls = [];
      for (const file of formData.files) {
        const filePath = `${user.id}/${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('support-files')
          .upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('support-files')
          .getPublicUrl(filePath);
        fileUrls.push(urlData.publicUrl);
      }

      // Insert report to Supabase
      const { error: insertError } = await supabase
        .from('support_reports')
        .insert([{
          title: formData.title,
          category: formData.category,
          urgency: formData.urgency,
          location: formData.location,
          description: formData.description,
          support_type: formData.supportType,
          skills: formData.skills,
          time_commitment: formData.timeCommitment,
          resources: formData.resources,
          contact_name: formData.contactName,
          contact_email: formData.contactEmail,
          contact_phone: formData.contactPhone,
          tags: formData.tags,
          user_id: user.id, // user_id is added here
          files: fileUrls,
        }]);

      if (insertError) throw insertError;

      setSubmitSuccess(true);
      setFormData({
        title: '',
        category: '',
        urgency: '',
        location: '',
        description: '',
        supportType: '',
        skills: [],
        timeCommitment: '',
        resources: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        files: [],
        tags: []
      });
      setCurrentStep(1);
    } catch (err) {
      alert("Failed to submit: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  } else {
    setErrors(newErrors);
  }
};


  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'low': return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      case 'medium': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'high': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      default: return 'border-gray-300 dark:border-gray-600';
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Support Offer Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Medical Supplies for Emergency Response"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Support Category *
              </label>
              <div className="grid md:grid-cols-2 gap-3">
                {categories.map((category) => (
                  <label
                    key={category.value}
                    className={`cursor-pointer p-4 border rounded-lg transition-colors ${
                      formData.category === category.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={category.value}
                      checked={formData.category === category.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="font-medium text-gray-900 dark:text-white mb-1">
                      {category.label}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {category.description}
                    </div>
                  </label>
                ))}
              </div>
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Urgency Level *
              </label>
              <div className="grid md:grid-cols-3 gap-3">
                {urgencyLevels.map((level) => (
                  <label
                    key={level.value}
                    className={`cursor-pointer p-4 border rounded-lg transition-colors ${
                      formData.urgency === level.value
                        ? getUrgencyColor(level.value)
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="urgency"
                      value={level.value}
                      checked={formData.urgency === level.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="font-medium text-gray-900 dark:text-white mb-1">
                      {level.label}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {level.description}
                    </div>
                  </label>
                ))}
              </div>
              {errors.urgency && <p className="mt-1 text-sm text-red-600">{errors.urgency}</p>}
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white ${
                    errors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="City, State or Region where support is available"
                />
              </div>
              {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white resize-none ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe what support you can provide and any specific details..."
              ></textarea>
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Type of Support *
              </label>
              <div className="grid md:grid-cols-2 gap-3">
                {supportTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`cursor-pointer p-4 border rounded-lg transition-colors flex items-center space-x-3 ${
                      formData.supportType === type.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="supportType"
                      value={type.value}
                      checked={formData.supportType === type.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="text-blue-600 dark:text-blue-400">
                      {type.icon}
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {type.label}
                    </div>
                  </label>
                ))}
              </div>
              {errors.supportType && <p className="mt-1 text-sm text-red-600">{errors.supportType}</p>}
            </div>

            {formData.supportType === 'skills' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Skills Available *
                </label>
                <div className="grid md:grid-cols-3 gap-2">
                  {skillOptions.map((skill) => (
                    <label
                      key={skill}
                      className={`cursor-pointer p-3 border rounded-lg text-sm transition-colors ${
                        formData.skills.includes(skill)
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.skills.includes(skill)}
                        onChange={() => handleSkillToggle(skill)}
                        className="sr-only"
                      />
                      {skill}
                    </label>
                  ))}
                </div>
                {errors.skills && <p className="mt-1 text-sm text-red-600">{errors.skills}</p>}
              </div>
            )}

            {formData.supportType === 'volunteer' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Time Commitment *
                </label>
                <div className="space-y-2">
                  {timeCommitments.map((time) => (
                    <label
                      key={time.value}
                      className={`cursor-pointer p-3 border rounded-lg block transition-colors ${
                        formData.timeCommitment === time.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="timeCommitment"
                        value={time.value}
                        checked={formData.timeCommitment === time.value}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="font-medium text-gray-900 dark:text-white">
                        {time.label}
                      </div>
                    </label>
                  ))}
                </div>
                {errors.timeCommitment && <p className="mt-1 text-sm text-red-600">{errors.timeCommitment}</p>}
              </div>
            )}

            {(formData.supportType === 'resources' || formData.supportType === 'funding') && (
              <div>
                <label htmlFor="resources" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Resource Details
                </label>
                <textarea
                  id="resources"
                  name="resources"
                  rows={4}
                  value={formData.resources}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white resize-none"
                  placeholder="Describe the resources you can provide (items, equipment, funding amount, etc.)"
                ></textarea>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contact Name *
                </label>
                <input
                  type="text"
                  id="contactName"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white ${
                    errors.contactName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Your full name"
                />
                {errors.contactName && <p className="mt-1 text-sm text-red-600">{errors.contactName}</p>}
              </div>

              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white ${
                    errors.contactEmail ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="your@email.com"
                />
                {errors.contactEmail && <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                id="contactPhone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Supporting Documents (Optional)
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="text-gray-600 dark:text-gray-400 mb-2">
                  Drag and drop files here, or
                  <label className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline ml-1">
                    browse files
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="sr-only"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                  </label>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Max 5 files, 10MB each. PDF, DOC, or image files.
                </div>
              </div>

              {formData.files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {formData.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Upload className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Add Tags (Optional)
              </label>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Tags help us match your offer with the right teams more effectively.
              </p>
              <div className="grid md:grid-cols-2 gap-2">
                {tagSuggestions.map((tag) => (
                  <label
                    key={tag}
                    className={`cursor-pointer p-3 border rounded-lg text-sm transition-colors ${
                      formData.tags.includes(tag)
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.tags.includes(tag)}
                      onChange={() => handleTagToggle(tag)}
                      className="sr-only"
                    />
                    #{tag.replace('-', ' ')}
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Summary of Your Support Offer
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Title:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">{formData.title}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Category:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">
                    {categories.find(c => c.value === formData.category)?.label}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Support Type:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">
                    {supportTypes.find(s => s.value === formData.supportType)?.label}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Location:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">{formData.location}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Contact:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">{formData.contactEmail}</span>
                </div>
                {formData.tags.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Tags:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs rounded"
                        >
                          #{tag.replace('-', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
            <CheckCircle className="text-green-500 text-5xl mb-4 mx-auto" />
            <h2 className="text-2xl font-bold mb-2">Support Offer Submitted!</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Thank you for your support. We'll match you with relevant teams soon.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Submit Support Offer
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Share your skills, time, or resources to help communities in need
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          {renderStep()}

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Previous</span>
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <span>Next</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                disabled={isSubmitting}
              >
                <Send className="h-5 w-5" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Offer'}</span>
              </button>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Need help? <a href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">Contact our support team</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubmitReport;