"use client"

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectOption } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { createHRMailtoUrl } from '@/utils/emailUtils'
import { useErrorHandler } from "@/hooks/useErrorHandler"
import { DataCollectionManager } from '@/utils/cookieManager'

export function HumanResourcesFirstStepPage() {
  const t = useTranslations('HumanResourcesPage.firstStep')
  const tEmail = useTranslations('emailUtils') // Separate translation hook for emailUtils
    const { handleError } = useErrorHandler()
  const locale = useLocale()
  
  // Get email messages from translations
  const emailMessages = {
    errors: {
      invalidFormData: tEmail('errors.invalidFormData'),
      invalidHRFormData: tEmail('errors.invalidHRFormData'),
      invalidName: tEmail('errors.invalidName'),
      invalidFirstName: tEmail('errors.invalidFirstName'),
      invalidLastName: tEmail('errors.invalidLastName'),
      invalidEmail: tEmail('errors.invalidEmail'),
      invalidPhone: tEmail('errors.invalidPhone'),
      invalidSubject: tEmail('errors.invalidSubject'),
      invalidMessage: tEmail('errors.invalidMessage'),
      contactFormError: tEmail('errors.contactFormError'),
      hrFormError: tEmail('errors.hrFormError')
    },
    labels: {
      notSpecified: tEmail('labels.notSpecified'),
      invalidEmailFormat: tEmail('labels.invalidEmailFormat'),
      emailTooLong: tEmail('labels.emailTooLong'),
      turkish: tEmail('labels.turkish'),
      english: tEmail('labels.english'),
      yes: tEmail('labels.yes'),
      no: tEmail('labels.no'),
      available: tEmail('labels.available'),
      none: tEmail('labels.none'),
      single: tEmail('labels.single'),
      married: tEmail('labels.married'),
      male: tEmail('labels.male'),
      female: tEmail('labels.female'),
      working: tEmail('labels.working'),
      notWorking: tEmail('labels.notWorking'),
      tcCitizen: tEmail('labels.tcCitizen'),
      other: tEmail('labels.other'),
      willShare: tEmail('labels.willShare'),
      laterIfNeeded: tEmail('labels.laterIfNeeded')
    },
    emailContent: {
      contact: {
        subject: tEmail('emailContent.contact.subject'),
        greeting: tEmail('emailContent.contact.greeting'),
        intro: tEmail('emailContent.contact.intro'),
        contactInfoHeader: tEmail('emailContent.contact.contactInfoHeader'),
        messageHeader: tEmail('emailContent.contact.messageHeader'),
        additionalInfoHeader: tEmail('emailContent.contact.additionalInfoHeader'),
        fullName: tEmail('emailContent.contact.fullName'),
        email: tEmail('emailContent.contact.email'),
        phone: tEmail('emailContent.contact.phone'),
        pageLanguage: tEmail('emailContent.contact.pageLanguage'),
        sendDate: tEmail('emailContent.contact.sendDate'),
        footer: tEmail('emailContent.contact.footer'),
        regards: tEmail('emailContent.contact.regards'),
        messageTruncated: tEmail('emailContent.contact.messageTruncated')
      },
      hr: {
        subject: tEmail('emailContent.hr.subject'),
        greeting: tEmail('emailContent.hr.greeting'),
        intro: tEmail('emailContent.hr.intro'),
        personalInfoHeader: tEmail('emailContent.hr.personalInfoHeader'),
        educationInfoHeader: tEmail('emailContent.hr.educationInfoHeader'),
        workExperienceHeader: tEmail('emailContent.hr.workExperienceHeader'),
        contactInfoHeader: tEmail('emailContent.hr.contactInfoHeader'),
        positionPreferencesHeader: tEmail('emailContent.hr.positionPreferencesHeader'),
        referencesHeader: tEmail('emailContent.hr.referencesHeader'),
        additionalInfoHeader: tEmail('emailContent.hr.additionalInfoHeader'),
        firstName: tEmail('emailContent.hr.firstName'),
        lastName: tEmail('emailContent.hr.lastName'),
        birthDate: tEmail('emailContent.hr.birthDate'),
        birthPlace: tEmail('emailContent.hr.birthPlace'),
        nationality: tEmail('emailContent.hr.nationality'),
        driverLicense: tEmail('emailContent.hr.driverLicense'),
        disability: tEmail('emailContent.hr.disability'),
        maritalStatus: tEmail('emailContent.hr.maritalStatus'),
        gender: tEmail('emailContent.hr.gender'),
        smoking: tEmail('emailContent.hr.smoking'),
        educationLevel: tEmail('emailContent.hr.educationLevel'),
        schoolName: tEmail('emailContent.hr.schoolName'),
        schoolType: tEmail('emailContent.hr.schoolType'),
        department: tEmail('emailContent.hr.department'),
        graduationYear: tEmail('emailContent.hr.graduationYear'),
        additionalEducation: tEmail('emailContent.hr.additionalEducation'),
        additionalEducationDetails: tEmail('emailContent.hr.additionalEducationDetails'),
        activeWorkStatus: tEmail('emailContent.hr.activeWorkStatus'),
        experienceDuration: tEmail('emailContent.hr.experienceDuration'),
        previousWorkplaces: tEmail('emailContent.hr.previousWorkplaces'),
        certificates: tEmail('emailContent.hr.certificates'),
        email: tEmail('emailContent.hr.email'),
        phone: tEmail('emailContent.hr.phone'),
        city: tEmail('emailContent.hr.city'),
        address: tEmail('emailContent.hr.address'),
        preferredPositions: tEmail('emailContent.hr.preferredPositions'),
        otherPositionRequest: tEmail('emailContent.hr.otherPositionRequest'),
        salaryExpectation: tEmail('emailContent.hr.salaryExpectation'),
        referencePreference: tEmail('emailContent.hr.referencePreference'),
        referenceName: tEmail('emailContent.hr.referenceName'),
        referenceCompany: tEmail('emailContent.hr.referenceCompany'),
        referencePosition: tEmail('emailContent.hr.referencePosition'),
        referencePhone: tEmail('emailContent.hr.referencePhone'),
        additionalReferenceInfo: tEmail('emailContent.hr.additionalReferenceInfo'),
        pageLanguage: tEmail('emailContent.hr.pageLanguage'),
        applicationDate: tEmail('emailContent.hr.applicationDate'),
        footer: tEmail('emailContent.hr.footer'),
        regards: tEmail('emailContent.hr.regards'),
        applicationTruncated: tEmail('emailContent.hr.applicationTruncated')
      }
    },
    fallback: {
      contactSubject: tEmail('fallback.contactSubject'),
      contactBody: tEmail('fallback.contactBody'),
      hrSubject: tEmail('fallback.hrSubject'),
      hrBody: tEmail('fallback.hrBody'),
      unknownApplicant: tEmail('fallback.unknownApplicant')
    }
  }
  
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    birthDate: '',
    birthPlace: '',
    nationality: 'tc',
    otherNationality: '',
    driverLicense: 'none',
    driverLicenseClasses: '',
    disability: 'none',
    disabilityDescription: '',
    maritalStatus: 'single',
    gender: 'male',
    smoking: 'no',
    educationLevel: 'highSchool',
    
    // Education Info
    schoolName: '',
    schoolType: 'highSchool',
    department: '',
    graduationYear: '',
    additionalEducation: false,
    additionalEducationInfo: '',
    
    // Work Experience
    activeWorkStatus: 'notWorking',
    experienceDuration: 'none',
    previousWorkplaces: '',
    certificates: 'none',
    certificatesInfo: '',
    
    // Contact Info
    photo: null as File | null,
    email: '',
    phone: '',
    city: '',
    address: '',
    
    // Position Preferences
    preferredPositions: [] as string[],
    additionalPositionRequest: false,
    otherPositionPreference: '',
    salaryExpectation: '',
    
    // References
    referencePreference: 'laterIfNeeded',
    referenceName: '',
    referenceCompany: '',
    referencePosition: '',
    referencePhone: '',
    additionalReference: false,
    additionalReferenceInfo: '',
    
    // Consent
    consent: false
  })

  const handleInputChange = (field: string, value: string | boolean | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    if (field === 'preferredPositions') {
      setFormData(prev => ({
        ...prev,
        preferredPositions: checked 
          ? [...prev.preferredPositions, value]
          : prev.preferredPositions.filter(pos => pos !== value)
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Mail gönderim URL'sini oluştur - now with proper error handling
      const mailtoUrl = createHRMailtoUrl(formData, locale, emailMessages)
      // Store form submission data for transparency and compliance
      DataCollectionManager.storeFormSubmission('hr', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        educationLevel: formData.educationLevel,
        experienceDuration: formData.experienceDuration,
        preferredPositions: formData.preferredPositions,
        salaryExpectation: formData.salaryExpectation ? 'specified' : 'not-specified', // Don't store actual salary for privacy
        locale: locale,
        hasPhoto: !!formData.photo,
        consentGiven: formData.consent
      })
      // Kullanıcıyı mail uygulamasına yönlendir
      window.location.href = mailtoUrl
      
      // Form verilerini temizle
      setFormData({
        // Personal Info
        firstName: '',
        lastName: '',
        birthDate: '',
        birthPlace: '',
        nationality: 'tc',
        otherNationality: '',
        driverLicense: 'none',
        driverLicenseClasses: '',
        disability: 'none',
        disabilityDescription: '',
        maritalStatus: 'single',
        gender: 'male',
        smoking: 'no',
        educationLevel: 'highSchool',
        
        // Education Info
        schoolName: '',
        schoolType: 'highSchool',
        department: '',
        graduationYear: '',
        additionalEducation: false,
        additionalEducationInfo: '',
        
        // Work Experience
        activeWorkStatus: 'notWorking',
        experienceDuration: 'none',
        previousWorkplaces: '',
        certificates: 'none',
        certificatesInfo: '',
        
        // Contact Info
        photo: null as File | null,
        email: '',
        phone: '',
        city: '',
        address: '',
        
        // Position Preferences
        preferredPositions: [] as string[],
        additionalPositionRequest: false,
        otherPositionPreference: '',
        salaryExpectation: '',
        
        // References
        referencePreference: 'laterIfNeeded',
        referenceName: '',
        referenceCompany: '',
        referencePosition: '',
        referencePhone: '',
        additionalReference: false,
        additionalReferenceInfo: '',
        
        // Consent
        consent: false
      })
    } catch (error) {
      console.error('Form submission error:', error)
      
      // Show toast notification for validation errors
      let errorMessage = emailMessages.errors.hrFormError
      if (error instanceof Error) {
        errorMessage = error.message
      }
      
      handleError(error, {
        toastMessage: errorMessage,
        logToConsole: true
      })
    }
  }

  return (
    <div className="py-20 lg:py-32 container mx-auto px-4">
      <div className="animate-fade-in-up">
        <SectionHeader 
          title={t('title')} 
          subtitle={t('subtitle')} 
        />
      </div>
      
      <div className="max-w-6xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-12">
          
          {/* Personal Information */}
          <div className="animate-fade-in-up animation-delay-200">
            <h2 className="responsive-text-2xl font-semibold mb-6 text-primary">
              {t('personalInfo.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Input 
                placeholder={t('personalInfo.firstName')} 
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required
              />
              <Input 
                placeholder={t('personalInfo.lastName')} 
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
              />
              <Input 
                type="date" 
                placeholder={t('personalInfo.birthDate')} 
                value={formData.birthDate}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
                required
              />
              <Input 
                placeholder={t('personalInfo.birthPlace')} 
                value={formData.birthPlace}
                onChange={(e) => handleInputChange('birthPlace', e.target.value)}
                required
              />
              
              <div>
                <label className="block text-sm font-medium mb-2">{t('personalInfo.nationality')}</label>
                <Select 
                  value={formData.nationality}
                  onChange={(e) => handleInputChange('nationality', e.target.value)}
                >
                  <SelectOption value="tc">{t('personalInfo.nationalityOptions.tc')}</SelectOption>
                  <SelectOption value="other">{t('personalInfo.nationalityOptions.other')}</SelectOption>
                </Select>
              </div>
              
              {formData.nationality === 'other' && (
                <Input 
                  placeholder={t('personalInfo.otherNationality')} 
                  value={formData.otherNationality}
                  onChange={(e) => handleInputChange('otherNationality', e.target.value)}
                />
              )}
              
              <div>
                <label className="block text-sm font-medium mb-2">{t('personalInfo.driverLicense')}</label>
                <Select 
                  value={formData.driverLicense}
                  onChange={(e) => handleInputChange('driverLicense', e.target.value)}
                >
                  <SelectOption value="none">{t('personalInfo.driverLicenseOptions.none')}</SelectOption>
                  <SelectOption value="available">{t('personalInfo.driverLicenseOptions.available')}</SelectOption>
                </Select>
              </div>
              
              {formData.driverLicense === 'available' && (
                <Input 
                  placeholder={t('personalInfo.driverLicenseClasses')} 
                  value={formData.driverLicenseClasses}
                  onChange={(e) => handleInputChange('driverLicenseClasses', e.target.value)}
                />
              )}
              
              <div>
                <label className="block text-sm font-medium mb-2">{t('personalInfo.disability')}</label>
                <Select 
                  value={formData.disability}
                  onChange={(e) => handleInputChange('disability', e.target.value)}
                >
                  <SelectOption value="none">{t('personalInfo.disabilityOptions.none')}</SelectOption>
                  <SelectOption value="available">{t('personalInfo.disabilityOptions.available')}</SelectOption>
                </Select>
              </div>
              
              {formData.disability === 'available' && (
                <Textarea 
                  placeholder={t('personalInfo.disabilityDescription')} 
                  value={formData.disabilityDescription}
                  onChange={(e) => handleInputChange('disabilityDescription', e.target.value)}
                />
              )}
              
              <div>
                <label className="block text-sm font-medium mb-2">{t('personalInfo.maritalStatus')}</label>
                <Select 
                  value={formData.maritalStatus}
                  onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                >
                  <SelectOption value="single">{t('personalInfo.maritalStatusOptions.single')}</SelectOption>
                  <SelectOption value="married">{t('personalInfo.maritalStatusOptions.married')}</SelectOption>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">{t('personalInfo.gender')}</label>
                <Select 
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                >
                  <SelectOption value="male">{t('personalInfo.genderOptions.male')}</SelectOption>
                  <SelectOption value="female">{t('personalInfo.genderOptions.female')}</SelectOption>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">{t('personalInfo.smoking')}</label>
                <Select 
                  value={formData.smoking}
                  onChange={(e) => handleInputChange('smoking', e.target.value)}
                >
                  <SelectOption value="no">{t('personalInfo.smokingOptions.no')}</SelectOption>
                  <SelectOption value="yes">{t('personalInfo.smokingOptions.yes')}</SelectOption>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">{t('personalInfo.educationLevel')}</label>
                <Select 
                  value={formData.educationLevel}
                  onChange={(e) => handleInputChange('educationLevel', e.target.value)}
                >
                  <SelectOption value="primary">{t('personalInfo.educationLevelOptions.primary')}</SelectOption>
                  <SelectOption value="highSchool">{t('personalInfo.educationLevelOptions.highSchool')}</SelectOption>
                  <SelectOption value="associate">{t('personalInfo.educationLevelOptions.associate')}</SelectOption>
                  <SelectOption value="bachelor">{t('personalInfo.educationLevelOptions.bachelor')}</SelectOption>
                  <SelectOption value="master">{t('personalInfo.educationLevelOptions.master')}</SelectOption>
                  <SelectOption value="doctorate">{t('personalInfo.educationLevelOptions.doctorate')}</SelectOption>
                </Select>
              </div>
            </div>
          </div>

          {/* Education Information */}
          <div className="animate-fade-in-up animation-delay-400">
            <h2 className="responsive-text-2xl font-semibold mb-6 text-primary">
              {t('educationInfo.title')}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">{t('educationInfo.subtitle')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                placeholder={t('educationInfo.schoolName')} 
                value={formData.schoolName}
                onChange={(e) => handleInputChange('schoolName', e.target.value)}
              />
              <div>
                <label className="block text-sm font-medium mb-2">{t('educationInfo.schoolType')}</label>
                <Select 
                  value={formData.schoolType}
                  onChange={(e) => handleInputChange('schoolType', e.target.value)}
                >
                  <SelectOption value="primary">{t('personalInfo.educationLevelOptions.primary')}</SelectOption>
                  <SelectOption value="highSchool">{t('personalInfo.educationLevelOptions.highSchool')}</SelectOption>
                  <SelectOption value="associate">{t('personalInfo.educationLevelOptions.associate')}</SelectOption>
                  <SelectOption value="bachelor">{t('personalInfo.educationLevelOptions.bachelor')}</SelectOption>
                  <SelectOption value="master">{t('personalInfo.educationLevelOptions.master')}</SelectOption>
                  <SelectOption value="doctorate">{t('personalInfo.educationLevelOptions.doctorate')}</SelectOption>
                </Select>
              </div>
              <Input 
                placeholder={t('educationInfo.department')} 
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
              />
              <Input 
                type="number" 
                placeholder={t('educationInfo.graduationYear')} 
                value={formData.graduationYear}
                onChange={(e) => handleInputChange('graduationYear', e.target.value)}
              />
            </div>
            
            <div className="mt-6">
              <Checkbox 
                label={t('educationInfo.additionalEducation')}
                checked={formData.additionalEducation}
                onCheckedChange={(checked) => handleInputChange('additionalEducation', checked)}
              />
              {formData.additionalEducation && (
                <div className="mt-4">
                  <Textarea 
                    placeholder={t('educationInfo.additionalEducationInfo')} 
                    value={formData.additionalEducationInfo}
                    onChange={(e) => handleInputChange('additionalEducationInfo', e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Work Experience */}
          <div className="animate-fade-in-up animation-delay-600">
            <h2 className="responsive-text-2xl font-semibold mb-6 text-primary">
              {t('workExperience.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">{t('workExperience.activeWorkStatus')}</label>
                <Select 
                  value={formData.activeWorkStatus}
                  onChange={(e) => handleInputChange('activeWorkStatus', e.target.value)}
                >
                  <SelectOption value="notWorking">{t('workExperience.activeWorkStatusOptions.notWorking')}</SelectOption>
                  <SelectOption value="working">{t('workExperience.activeWorkStatusOptions.working')}</SelectOption>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">{t('workExperience.experienceDuration')}</label>
                <Select 
                  value={formData.experienceDuration}
                  onChange={(e) => handleInputChange('experienceDuration', e.target.value)}
                >
                  <SelectOption value="none">{t('workExperience.experienceDurationOptions.none')}</SelectOption>
                  <SelectOption value="oneYear">{t('workExperience.experienceDurationOptions.oneYear')}</SelectOption>
                  <SelectOption value="twoYears">{t('workExperience.experienceDurationOptions.twoYears')}</SelectOption>
                  <SelectOption value="threeYears">{t('workExperience.experienceDurationOptions.threeYears')}</SelectOption>
                  <SelectOption value="fourYears">{t('workExperience.experienceDurationOptions.fourYears')}</SelectOption>
                  <SelectOption value="fiveYears">{t('workExperience.experienceDurationOptions.fiveYears')}</SelectOption>
                  <SelectOption value="sixPlusYears">{t('workExperience.experienceDurationOptions.sixPlusYears')}</SelectOption>
                </Select>
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">{t('workExperience.previousWorkplaces')}</label>
              <p className="text-sm text-muted-foreground mb-2">{t('workExperience.previousWorkplacesDescription')}</p>
              <Textarea 
                placeholder={t('workExperience.previousWorkplaces')} 
                value={formData.previousWorkplaces}
                onChange={(e) => handleInputChange('previousWorkplaces', e.target.value)}
              />
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">{t('workExperience.certificates')}</label>
              <Select 
                value={formData.certificates}
                onChange={(e) => handleInputChange('certificates', e.target.value)}
              >
                <SelectOption value="none">{t('workExperience.certificatesOptions.none')}</SelectOption>
                <SelectOption value="available">{t('workExperience.certificatesOptions.available')}</SelectOption>
              </Select>
              {formData.certificates === 'available' && (
                <div className="mt-4">
                  <Textarea 
                    placeholder={t('workExperience.certificatesInfo')} 
                    value={formData.certificatesInfo}
                    onChange={(e) => handleInputChange('certificatesInfo', e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="animate-fade-in-up animation-delay-800">
            <h2 className="responsive-text-2xl font-semibold mb-6 text-primary">
              {t('contactInfo.title')}
            </h2>
            
            {/* Photo Upload - Full Width Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">{t('contactInfo.photo')}</label>
              <p className="text-xs text-muted-foreground mb-2">{t('contactInfo.photoDescription')}</p>
              <div className="max-w-md">
                <Input 
                  type="file" 
                  accept=".jpg,.jpeg,.png"
                  onChange={(e) => handleInputChange('photo', e.target.files?.[0] || null)}
                />
              </div>
            </div>
            
            {/* Contact Fields - Better Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Input 
                type="email" 
                placeholder={t('contactInfo.email')} 
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
              <Input 
                type="tel" 
                placeholder={t('contactInfo.phone')} 
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
              />
              <Input 
                placeholder={t('contactInfo.city')} 
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                required
              />
            </div>
            
            {/* Address - Full Width */}
            <div className="mt-6">
              <Textarea 
                placeholder={t('contactInfo.address')} 
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            </div>
          </div>

          {/* Position Preferences */}
          <div className="animate-fade-in-up animation-delay-1000">
            <h2 className="responsive-text-2xl font-semibold mb-6 text-primary">
              {t('positionPreferences.title')}
            </h2>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-4">{t('positionPreferences.preferredPosition')}</label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(t.raw('positionPreferences.positionOptions')).map(([key, value]) => (
                  <Checkbox 
                    key={key}
                    label={value as string}
                    checked={formData.preferredPositions.includes(key)}
                    onCheckedChange={(checked) => handleCheckboxChange('preferredPositions', key, checked as boolean)}
                  />
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <Checkbox 
                label={t('positionPreferences.additionalPositionRequest')}
                checked={formData.additionalPositionRequest}
                onCheckedChange={(checked) => handleInputChange('additionalPositionRequest', checked)}
              />
              {formData.additionalPositionRequest && (
                <div className="mt-4">
                  <Input 
                    placeholder={t('positionPreferences.otherPositionPreference')} 
                    value={formData.otherPositionPreference}
                    onChange={(e) => handleInputChange('otherPositionPreference', e.target.value)}
                  />
                </div>
              )}
            </div>
            
            <Input 
              placeholder={t('positionPreferences.salaryExpectation')} 
              value={formData.salaryExpectation}
              onChange={(e) => handleInputChange('salaryExpectation', e.target.value)}
              required
            />
          </div>

          {/* References */}
          <div className="animate-fade-in-up animation-delay-1200">
            <h2 className="responsive-text-2xl font-semibold mb-6 text-primary">
              {t('references.title')}
            </h2>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">{t('references.referencePreference')}</label>
              <Select 
                value={formData.referencePreference}
                onChange={(e) => handleInputChange('referencePreference', e.target.value)}
              >
                <SelectOption value="laterIfNeeded">{t('references.referenceOptions.laterIfNeeded')}</SelectOption>
                <SelectOption value="willShare">{t('references.referenceOptions.willShare')}</SelectOption>
              </Select>
            </div>
            
            {formData.referencePreference === 'willShare' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Input 
                  placeholder={t('references.referenceName')} 
                  value={formData.referenceName}
                  onChange={(e) => handleInputChange('referenceName', e.target.value)}
                />
                <Input 
                  placeholder={t('references.referenceCompany')} 
                  value={formData.referenceCompany}
                  onChange={(e) => handleInputChange('referenceCompany', e.target.value)}
                />
                <Input 
                  placeholder={t('references.referencePosition')} 
                  value={formData.referencePosition}
                  onChange={(e) => handleInputChange('referencePosition', e.target.value)}
                />
                <Input 
                  type="tel" 
                  placeholder={t('references.referencePhone')} 
                  value={formData.referencePhone}
                  onChange={(e) => handleInputChange('referencePhone', e.target.value)}
                />
              </div>
            )}
            
            <div className="mb-6">
              <Checkbox 
                label={t('references.additionalReference')}
                checked={formData.additionalReference}
                onCheckedChange={(checked) => handleInputChange('additionalReference', checked)}
              />
              {formData.additionalReference && (
                <div className="mt-4">
                  <Textarea 
                    placeholder={t('references.additionalReferenceInfo')} 
                    value={formData.additionalReferenceInfo}
                    onChange={(e) => handleInputChange('additionalReferenceInfo', e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Consent */}
          <div className="animate-fade-in-up animation-delay-1400">
            <h2 className="responsive-text-2xl font-semibold mb-6 text-primary">
              {t('consent.title')}
            </h2>
            <Checkbox 
              label={t('consent.consentText')}
              checked={formData.consent}
              onCheckedChange={(checked) => handleInputChange('consent', checked)}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="text-center animate-fade-in-up animation-delay-1600">
            <Button 
              type="submit" 
              size="lg"
              className="px-12 py-3 text-lg"
              disabled={!formData.consent}
            >
              {t('submit')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default HumanResourcesFirstStepPage
