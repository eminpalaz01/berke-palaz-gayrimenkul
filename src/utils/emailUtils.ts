/**
 * Email gönderim yardımcı fonksiyonları
 * Kullanıcıları mail uygulamasına yönlendirir
 * Internationalized version with proper error handling
 */

interface ContactFormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

interface HRFormData {
  // Personal Info
  firstName: string
  lastName: string
  birthDate: string
  birthPlace: string
  nationality: string
  otherNationality: string
  driverLicense: string
  driverLicenseClasses: string
  disability: string
  disabilityDescription: string
  maritalStatus: string
  gender: string
  smoking: string
  educationLevel: string
  
  // Education Info
  schoolName: string
  schoolType: string
  department: string
  graduationYear: string
  additionalEducation: boolean
  additionalEducationInfo: string
  
  // Work Experience
  activeWorkStatus: string
  experienceDuration: string
  previousWorkplaces: string
  certificates: string
  certificatesInfo: string
  
  // Contact Info
  email: string
  phone: string
  city: string
  address: string
  
  // Position Preferences
  preferredPositions: string[]
  additionalPositionRequest: boolean
  otherPositionPreference: string
  salaryExpectation: string
  
  // References
  referencePreference: string
  referenceName: string
  referenceCompany: string
  referencePosition: string
  referencePhone: string
  additionalReference: boolean
  additionalReferenceInfo: string
}

interface EmailMessages {
  errors: {
    invalidFormData: string
    invalidHRFormData: string
    invalidName: string
    invalidFirstName: string
    invalidLastName: string
    invalidEmail: string
    invalidPhone: string
    invalidSubject: string
    invalidMessage: string
    contactFormError: string
    hrFormError: string
  }
  labels: {
    notSpecified: string
    invalidEmailFormat: string
    emailTooLong: string
    turkish: string
    english: string
    yes: string
    no: string
    available: string
    none: string
    single: string
    married: string
    male: string
    female: string
    working: string
    notWorking: string
    tcCitizen: string
    other: string
    willShare: string
    laterIfNeeded: string
  }
  emailContent: {
    contact: {
      subject: string
      greeting: string
      intro: string
      contactInfoHeader: string
      messageHeader: string
      additionalInfoHeader: string
      fullName: string
      email: string
      phone: string
      pageLanguage: string
      sendDate: string
      footer: string
      regards: string
      messageTruncated: string
    }
    hr: {
      subject: string
      greeting: string
      intro: string
      personalInfoHeader: string
      educationInfoHeader: string
      workExperienceHeader: string
      contactInfoHeader: string
      positionPreferencesHeader: string
      referencesHeader: string
      additionalInfoHeader: string
      firstName: string
      lastName: string
      birthDate: string
      birthPlace: string
      nationality: string
      driverLicense: string
      disability: string
      maritalStatus: string
      gender: string
      smoking: string
      educationLevel: string
      schoolName: string
      schoolType: string
      department: string
      graduationYear: string
      additionalEducation: string
      additionalEducationDetails: string
      activeWorkStatus: string
      experienceDuration: string
      previousWorkplaces: string
      certificates: string
      email: string
      phone: string
      city: string
      address: string
      preferredPositions: string
      otherPositionRequest: string
      salaryExpectation: string
      referencePreference: string
      referenceName: string
      referenceCompany: string
      referencePosition: string
      referencePhone: string
      additionalReferenceInfo: string
      pageLanguage: string
      applicationDate: string
      footer: string
      regards: string
      applicationTruncated: string
    }
  }
  fallback: {
    contactSubject: string
    contactBody: string
    hrSubject: string
    hrBody: string
    unknownApplicant: string
  }
}

/**
 * Input sanitization için yardımcı fonksiyon
 */
function sanitizeInput(input: string | null | undefined, messages: EmailMessages): string {
  // Null/undefined/empty string kontrolleri
  if (!input || typeof input !== 'string' || input.trim().length === 0) {
    return messages?.labels?.notSpecified || 'Belirtilmemiş'
  }
  
  // XSS ve injection saldırılarına karşı kapsamlı temizlik
  return input
    .trim()
    .replace(/[<>]/g, '') // HTML tag karakterlerini kaldır
    .replace(/javascript:/gi, '') // JavaScript protokolünü kaldır
    .replace(/data:/gi, '') // Data protokolünü kaldır
    .replace(/vbscript:/gi, '') // VBScript protokolünü kaldır
    .replace(/on\w+=/gi, '') // Event handler'ları kaldır (onclick, onload, vb.)
    .replace(/[\x00-\x1F\x7F]/g, '') // Kontrol karakterlerini kaldır
    .substring(0, 1000) // Maksimum uzunluk sınırı
}

/**
 * Email adresini doğrula ve sanitize et
 */
function sanitizeEmail(email: string | null | undefined, messages: EmailMessages): string {
  // Null/undefined/empty kontrolleri
  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    return messages?.labels?.notSpecified || 'Belirtilmemiş'
  }
  
  const trimmedEmail = email.trim()
  
  // Minimum uzunluk kontrolü
  if (trimmedEmail.length < 5) {
    return messages?.labels?.invalidEmailFormat || 'Geçersiz email formatı'
  }
  
  // Maksimum uzunluk kontrolü
  if (trimmedEmail.length > 254) {
    return messages?.labels?.emailTooLong || 'Email çok uzun'
  }
  
  // Güvenlik kontrolleri - zararlı karakterleri kaldır
  const cleanedEmail = trimmedEmail
    .replace(/[<>]/g, '') // HTML tag karakterleri
    .replace(/javascript:/gi, '') // JavaScript protokolü
    .replace(/[\x00-\x1F\x7F]/g, '') // Kontrol karakterleri
  
  // Gelişmiş email formatı kontrolü
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  if (!emailRegex.test(cleanedEmail)) {
    return messages?.labels?.invalidEmailFormat || 'Geçersiz email formatı'
  }
  
  return cleanedEmail
}

/**
 * Array değerlerini güvenli şekilde formatla
 */
function sanitizeArray(values: string[] | null | undefined, messages: EmailMessages): string[] {
  // Null/undefined kontrolleri
  if (!values || !Array.isArray(values) || values.length === 0) {
    return []
  }
  
  // Messages null kontrolü
  if (!messages || !messages.labels) {
    return []
  }
  
  return values
    .filter(value => value && typeof value === 'string' && value.trim().length > 0)
    .map(value => sanitizeInput(value, messages))
    .filter(value => value !== messages.labels.notSpecified && value.length > 0)
    .slice(0, 10) // Maksimum 10 öğe güvenlik sınırı
}

/**
 * Dil değerlerini formatla
 */
function getLanguageText(currentLanguage: string, messages: EmailMessages): string {
  return currentLanguage === 'tr' ? messages.labels.turkish : messages.labels.english
}

/**
 * Boolean değerleri güvenli formatla
 */
function formatBoolean(value: boolean | null | undefined, messages: EmailMessages): string {
  return value === true ? messages.labels.yes : messages.labels.no
}

/**
 * Çoklu seçim alanlarını güvenli formatla
 */
function formatMultipleChoice(values: string[] | null | undefined, messages: EmailMessages): string {
  const sanitizedValues = sanitizeArray(values, messages)
  return sanitizedValues.length > 0 ? sanitizedValues.join(', ') : messages.labels.notSpecified
}

/**
 * Contact form için mail içeriği oluşturur
 */
export function generateContactEmailContent(
  formData: ContactFormData | null | undefined, 
  currentLanguage: string | null | undefined,
  messages: EmailMessages | null | undefined
): string {
  // Messages null kontrolü - kritik güvenlik kontrolü
  if (!messages || typeof messages !== 'object' || !messages.errors || !messages.labels || !messages.emailContent) {
    throw new Error('Email messages configuration is missing or invalid')
  }
  
  // Null/undefined kontrolleri
  if (!formData || typeof formData !== 'object') {
    throw new Error(messages.errors.invalidFormData)
  }
  
  if (!currentLanguage || typeof currentLanguage !== 'string') {
    currentLanguage = 'tr' // Varsayılan dil
  }
  
  // Input sanitization
  const sanitizedName = sanitizeInput(formData.name, messages)
  const sanitizedEmail = sanitizeEmail(formData.email, messages)
  const sanitizedPhone = sanitizeInput(formData.phone, messages)
  const sanitizedSubject = sanitizeInput(formData.subject, messages)
  const sanitizedMessage = sanitizeInput(formData.message, messages)
  
  // Zorunlu alanların kontrolü
  if (sanitizedName === messages.labels.notSpecified || sanitizedName.length < 2) {
    throw new Error(messages.errors.invalidName)
  }
  
  if (sanitizedSubject === messages.labels.notSpecified || sanitizedSubject.length < 3) {
    throw new Error(messages.errors.invalidSubject)
  }
  
  if (sanitizedMessage === messages.labels.notSpecified || sanitizedMessage.length < 10) {
    throw new Error(messages.errors.invalidMessage)
  }
  
  const languageText = getLanguageText(currentLanguage, messages)
  
  const emailContent = `
${messages.emailContent.contact.subject}: ${sanitizedSubject}

${messages.emailContent.contact.greeting}

${messages.emailContent.contact.intro}

${messages.emailContent.contact.contactInfoHeader}
${messages.emailContent.contact.fullName}: ${sanitizedName}
${messages.emailContent.contact.email}: ${sanitizedEmail}
${messages.emailContent.contact.phone}: ${sanitizedPhone}

${messages.emailContent.contact.messageHeader}
${sanitizedMessage}

${messages.emailContent.contact.additionalInfoHeader}
${messages.emailContent.contact.pageLanguage}: ${languageText}
${messages.emailContent.contact.sendDate}: ${new Date().toLocaleString(currentLanguage === 'tr' ? 'tr-TR' : 'en-US')}

${messages.emailContent.contact.footer}

${messages.emailContent.contact.regards},
${sanitizedName}
  `.trim()

  return emailContent
}

/**
 * HR form için mail içeriği oluşturur
 */
export function generateHREmailContent(
  formData: HRFormData | null | undefined, 
  currentLanguage: string | null | undefined,
  messages: EmailMessages | null | undefined
): string {
  // Messages null kontrolü - kritik güvenlik kontrolü
  if (!messages || typeof messages !== 'object' || !messages.errors || !messages.labels || !messages.emailContent) {
    throw new Error('Email messages configuration is missing or invalid')
  }
  
  // Null/undefined kontrolleri
  if (!formData || typeof formData !== 'object') {
    throw new Error(messages.errors.invalidHRFormData)
  }
  
  if (!currentLanguage || typeof currentLanguage !== 'string') {
    currentLanguage = 'tr' // Varsayılan dil
  }
  
  const languageText = getLanguageText(currentLanguage, messages)
  
  // Tüm input alanlarını sanitize et
  const sanitizedFirstName = sanitizeInput(formData.firstName, messages)
  const sanitizedLastName = sanitizeInput(formData.lastName, messages)
  const sanitizedBirthDate = sanitizeInput(formData.birthDate, messages)
  const sanitizedBirthPlace = sanitizeInput(formData.birthPlace, messages)
  const sanitizedEmail = sanitizeEmail(formData.email, messages)
  const sanitizedPhone = sanitizeInput(formData.phone, messages)
  const sanitizedCity = sanitizeInput(formData.city, messages)
  
  // Zorunlu alanların kontrolü
  if (sanitizedFirstName === messages.labels.notSpecified || sanitizedFirstName.length < 2) {
    throw new Error(messages.errors.invalidFirstName)
  }
  
  if (sanitizedLastName === messages.labels.notSpecified || sanitizedLastName.length < 2) {
    throw new Error(messages.errors.invalidLastName)
  }
  
  if (sanitizedEmail === messages.labels.notSpecified || sanitizedEmail === messages.labels.invalidEmailFormat) {
    throw new Error(messages.errors.invalidEmail)
  }
  
  if (sanitizedPhone === messages.labels.notSpecified || sanitizedPhone.length < 10) {
    throw new Error(messages.errors.invalidPhone)
  }

  const emailContent = `
${messages.emailContent.hr.subject}: ${sanitizedFirstName} ${sanitizedLastName}

${messages.emailContent.hr.greeting}

${messages.emailContent.hr.intro}

${messages.emailContent.hr.personalInfoHeader}
${messages.emailContent.hr.firstName}: ${sanitizedFirstName}
${messages.emailContent.hr.lastName}: ${sanitizedLastName}
${messages.emailContent.hr.birthDate}: ${sanitizedBirthDate}
${messages.emailContent.hr.birthPlace}: ${sanitizedBirthPlace}
${messages.emailContent.hr.nationality}: ${formData.nationality === 'tc' ? messages.labels.tcCitizen : sanitizeInput(formData.otherNationality, messages) || messages.labels.other}
${messages.emailContent.hr.driverLicense}: ${formData.driverLicense === 'available' ? `${messages.labels.available} (${sanitizeInput(formData.driverLicenseClasses, messages)})` : messages.labels.none}
${messages.emailContent.hr.disability}: ${formData.disability === 'available' ? `${messages.labels.available} (${sanitizeInput(formData.disabilityDescription, messages)})` : messages.labels.none}
${messages.emailContent.hr.maritalStatus}: ${formData.maritalStatus === 'single' ? messages.labels.single : messages.labels.married}
${messages.emailContent.hr.gender}: ${formData.gender === 'male' ? messages.labels.male : messages.labels.female}
${messages.emailContent.hr.smoking}: ${formData.smoking === 'yes' ? messages.labels.yes : messages.labels.no}
${messages.emailContent.hr.educationLevel}: ${sanitizeInput(formData.educationLevel, messages)}

${messages.emailContent.hr.educationInfoHeader}
${messages.emailContent.hr.schoolName}: ${sanitizeInput(formData.schoolName, messages)}
${messages.emailContent.hr.schoolType}: ${sanitizeInput(formData.schoolType, messages)}
${messages.emailContent.hr.department}: ${sanitizeInput(formData.department, messages)}
${messages.emailContent.hr.graduationYear}: ${sanitizeInput(formData.graduationYear, messages)}
${messages.emailContent.hr.additionalEducation}: ${formatBoolean(formData.additionalEducation, messages)}
${formData.additionalEducation && formData.additionalEducationInfo ? `${messages.emailContent.hr.additionalEducationDetails}: ${sanitizeInput(formData.additionalEducationInfo, messages)}` : ''}

${messages.emailContent.hr.workExperienceHeader}
${messages.emailContent.hr.activeWorkStatus}: ${formData.activeWorkStatus === 'working' ? messages.labels.working : messages.labels.notWorking}
${messages.emailContent.hr.experienceDuration}: ${sanitizeInput(formData.experienceDuration, messages)}
${messages.emailContent.hr.previousWorkplaces}: ${sanitizeInput(formData.previousWorkplaces, messages)}
${messages.emailContent.hr.certificates}: ${formData.certificates === 'available' ? `${messages.labels.available} (${sanitizeInput(formData.certificatesInfo, messages)})` : messages.labels.none}

${messages.emailContent.hr.contactInfoHeader}
${messages.emailContent.hr.email}: ${sanitizedEmail}
${messages.emailContent.hr.phone}: ${sanitizedPhone}
${messages.emailContent.hr.city}: ${sanitizedCity}
${messages.emailContent.hr.address}: ${sanitizeInput(formData.address, messages)}

${messages.emailContent.hr.positionPreferencesHeader}
${messages.emailContent.hr.preferredPositions}: ${formatMultipleChoice(formData.preferredPositions, messages)}
${formData.additionalPositionRequest && formData.otherPositionPreference ? `${messages.emailContent.hr.otherPositionRequest}: ${sanitizeInput(formData.otherPositionPreference, messages)}` : ''}
${messages.emailContent.hr.salaryExpectation}: ${sanitizeInput(formData.salaryExpectation, messages)}

${messages.emailContent.hr.referencesHeader}
${messages.emailContent.hr.referencePreference}: ${formData.referencePreference === 'willShare' ? messages.labels.willShare : messages.labels.laterIfNeeded}
${formData.referencePreference === 'willShare' ? `
${messages.emailContent.hr.referenceName}: ${sanitizeInput(formData.referenceName, messages)}
${messages.emailContent.hr.referenceCompany}: ${sanitizeInput(formData.referenceCompany, messages)}
${messages.emailContent.hr.referencePosition}: ${sanitizeInput(formData.referencePosition, messages)}
${messages.emailContent.hr.referencePhone}: ${sanitizeInput(formData.referencePhone, messages)}` : ''}
${formData.additionalReference && formData.additionalReferenceInfo ? `${messages.emailContent.hr.additionalReferenceInfo}: ${sanitizeInput(formData.additionalReferenceInfo, messages)}` : ''}

${messages.emailContent.hr.additionalInfoHeader}
${messages.emailContent.hr.pageLanguage}: ${languageText}
${messages.emailContent.hr.applicationDate}: ${new Date().toLocaleString(currentLanguage === 'tr' ? 'tr-TR' : 'en-US')}

${messages.emailContent.hr.footer}

${messages.emailContent.hr.regards},
${sanitizedFirstName} ${sanitizedLastName}
  `.trim()

  return emailContent
}

/**
 * Contact form için mailto URL'si oluşturur
 */
export function createContactMailtoUrl(
  formData: ContactFormData | null | undefined, 
  currentLanguage: string | null | undefined,
  messages: EmailMessages
): string {
    // generateContactEmailContent içinde null kontrolleri yapılıyor
    const emailContent = generateContactEmailContent(formData, currentLanguage, messages)
    
    // Güvenli subject oluşturma
    const sanitizedSubject = formData ? sanitizeInput(formData.subject, messages) : messages.emailContent.contact.subject
    const subject = encodeURIComponent(`${messages.emailContent.contact.subject}: ${sanitizedSubject}`)
    const body = encodeURIComponent(emailContent)
    
    // URL uzunluk kontrolü (mailto URL'leri için tarayıcı limitleri)
    const maxUrlLength = 2000
    let finalBody = body
    
    if (subject.length + body.length > maxUrlLength) {
      // Body'yi kısalt
      const maxBodyLength = maxUrlLength - subject.length - 100 // Buffer için
      finalBody = body.substring(0, maxBodyLength) + encodeURIComponent(messages.emailContent.contact.messageTruncated)
    }
    
    return `mailto:info@selalebeton.com.tr?subject=${subject}&body=${finalBody}`
}

/**
 * HR form için mailto URL'si oluşturur
 */
export function createHRMailtoUrl(
  formData: HRFormData | null | undefined, 
  currentLanguage: string | null | undefined,
  messages: EmailMessages
): string {
    // generateHREmailContent içinde null kontrolleri yapılıyor
    const emailContent = generateHREmailContent(formData, currentLanguage, messages)
    
    // Güvenli subject oluşturma
    const sanitizedFirstName = formData ? sanitizeInput(formData.firstName, messages) : messages.fallback.unknownApplicant
    const sanitizedLastName = formData ? sanitizeInput(formData.lastName, messages) : ''
    const subject = encodeURIComponent(`${messages.emailContent.hr.subject} - ${sanitizedFirstName} ${sanitizedLastName}`)
    const body = encodeURIComponent(emailContent)
    
    // URL uzunluk kontrolü (mailto URL'leri için tarayıcı limitleri)
    const maxUrlLength = 2000
    let finalBody = body
    
    if (subject.length + body.length > maxUrlLength) {
      // Body'yi kısalt
      const maxBodyLength = maxUrlLength - subject.length - 100 // Buffer için
      finalBody = body.substring(0, maxBodyLength) + encodeURIComponent(messages.emailContent.hr.applicationTruncated)
    }
    
    return `mailto:info@selalebeton.com.tr?subject=${subject}&body=${finalBody}`
}
