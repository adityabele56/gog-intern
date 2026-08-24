import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck, Phone, Mail, MapPin, Building, Calendar, HeartPulse, GraduationCap } from 'lucide-react';

export const IDCardPreview = ({ card, templateId = 'modern', isLandscape = true, showBack = false }) => {
  if (!card) return null;

  const isStudent = card.cardType === 'Student' || !!card.college || !!card.rollNumber;

  const {
    fullName = 'FULL NAME',
    fatherName = '',
    motherName = '',
    employeeId = card.rollNumber || 'ID-0000',
    rollNumber = card.employeeId || '',
    designation = isStudent ? (card.branch || 'Student') : 'Designation',
    department = isStudent ? (card.course || 'Academic') : 'Department',
    companyName = isStudent ? (card.college || 'UNIVERSITY NAME') : (card.company || card.companyName || 'COMPANY NAME'),
    college = '',
    course = '',
    branch = '',
    semester = '',
    phone = '',
    email = '',
    address = '',
    city = '',
    state = '',
    pincode = '',
    bloodGroup = 'O+',
    dob = '',
    photoUrl = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
    logoUrl,
    signatureUrl,
    qrCodeUrl
  } = card;

  const displayId = isStudent ? (rollNumber || employeeId) : employeeId;

  const templates = {
    modern: {
      bg: 'bg-white',
      headerBg: 'bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500',
      accentColor: 'text-blue-600',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      bannerText: 'text-white'
    },
    corporate: {
      bg: 'bg-white',
      headerBg: 'bg-gradient-to-r from-sky-600 via-cyan-600 to-teal-500',
      accentColor: 'text-sky-600',
      badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
      bannerText: 'text-white'
    },
    executive: {
      bg: 'bg-white',
      headerBg: 'bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950',
      accentColor: 'text-slate-900',
      badgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
      bannerText: 'text-amber-400 font-bold'
    },
    minimal: {
      bg: 'bg-white',
      headerBg: 'bg-gradient-to-r from-emerald-600 to-teal-600',
      accentColor: 'text-emerald-600',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      bannerText: 'text-white'
    }
  };

  const theme = templates[templateId] || templates.modern;

  // Build clean full-details payload for QR scan (no password)
  const fullDetailsQR = JSON.stringify({
    cardType: isStudent ? 'Student' : 'Employee',
    fullName,
    id: displayId,
    institution: companyName,
    departmentOrCourse: department,
    roleOrBranch: designation,
    semester: semester || undefined,
    dob,
    bloodGroup,
    mobile: phone,
    email,
    address: address ? `${address}, ${city || ''} ${state || ''} ${pincode || ''}` : undefined,
    fatherName: fatherName || undefined,
    motherName: motherName || undefined
  }, null, 2);

  const renderQRCode = (size) => {
    if (qrCodeUrl) {
      return <img src={qrCodeUrl} alt="QR Code" style={{ width: `${size}px`, height: `${size}px` }} className="object-contain" crossOrigin="anonymous" />;
    }
    return <QRCodeSVG value={fullDetailsQR} size={size} level="M" />;
  };

  if (showBack) {
    return (
      <div
        className={`print-area relative bg-white border-2 border-slate-200 rounded-2xl shadow-xl overflow-hidden text-slate-800 flex flex-col justify-between transition-all ${
          isLandscape ? 'w-[440px] h-[270px] p-5' : 'w-[290px] h-[450px] p-6'
        }`}
      >
        <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Identity Verification & Terms
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">ID: {displayId}</span>
        </div>

        {/* Detailed Info on Back */}
        <div className="text-[10px] text-slate-600 leading-snug space-y-1 py-1">
          {fatherName && <p><span className="font-semibold text-slate-700">Father's Name:</span> {fatherName}</p>}
          {motherName && <p><span className="font-semibold text-slate-700">Mother's Name:</span> {motherName}</p>}
          {address && <p><span className="font-semibold text-slate-700">Address:</span> {address}, {city} {state} {pincode}</p>}
          <p className="text-[9px] text-slate-400 pt-1">• Non-transferable credential issued by {companyName}.</p>
          <p className="text-[9px] text-slate-400">• If found, please return to security or HR department.</p>
        </div>

        <div className="flex items-end justify-between border-t border-slate-100 pt-2">
          <div className="flex items-center gap-3">
            {renderQRCode(48)}
            <div className="text-[9px] text-slate-400 font-mono">
              <p className="font-bold text-slate-600">SCAN ALL DETAILS</p>
              <p>ENCRYPTED SMART RFID</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[9px] text-slate-400 uppercase tracking-wider">Authorized Signature</p>
            {signatureUrl ? (
              <img src={signatureUrl} alt="Signature" className="h-7 object-contain ml-auto mt-0.5" crossOrigin="anonymous" />
            ) : (
              <p className="font-serif italic text-slate-700 text-xs font-bold mt-1">Authorized Signatory</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Front Side
  return (
    <div
      className={`print-area relative bg-white border-2 border-slate-200 rounded-2xl shadow-xl overflow-hidden text-slate-800 transition-all ${
        isLandscape ? 'w-[440px] h-[270px] flex' : 'w-[290px] h-[450px] flex flex-col'
      }`}
    >
      {/* Header Banner */}
      <div
        className={`px-5 py-3 flex items-center justify-between shadow-xs ${theme.headerBg} ${
          isLandscape ? 'w-full absolute top-0 left-0 right-0 h-14' : 'w-full h-16'
        }`}
      >
        <div className="flex items-center gap-2.5 max-w-[80%]">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="w-7 h-7 rounded-md object-contain bg-white/90 p-0.5 shrink-0" crossOrigin="anonymous" />
          ) : (
            <div className="w-7 h-7 rounded-md bg-white/20 flex items-center justify-center text-white font-black text-xs shrink-0">
              {isStudent ? <GraduationCap className="w-4 h-4 text-white" /> : 'ID'}
            </div>
          )}
          <span className={`text-xs uppercase tracking-wider font-extrabold break-words line-clamp-1 ${theme.bannerText}`}>
            {companyName}
          </span>
        </div>
        <span className="text-[10px] font-mono bg-black/20 text-white px-2 py-0.5 rounded-md font-semibold tracking-wider shrink-0">
          {isStudent ? 'STUDENT ID' : 'OFFICIAL ID'}
        </span>
      </div>

      {/* Main Content Area */}
      {isLandscape ? (
        <div className="w-full pt-16 p-4 flex gap-3.5 items-center">
          {/* Photo Box - Fitted cleanly without cutting head/hair/body */}
          <div className="flex flex-col items-center gap-1 shrink-0">
            <div className="w-24 h-28 rounded-xl overflow-hidden border-2 border-white shadow-md bg-slate-100 p-0.5 flex items-center justify-center">
              <img
                src={photoUrl}
                alt={fullName}
                className="w-full h-full object-contain object-top rounded-lg"
                crossOrigin="anonymous"
              />
            </div>
            <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-md max-w-[100px] truncate">
              {displayId}
            </span>
          </div>

          {/* Details Column - Displays complete information without hiding */}
          <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight leading-snug break-words">
                {fullName}
              </h3>
              <p className={`text-xs font-bold mt-0.5 ${theme.accentColor} break-words`}>
                {designation}
              </p>
              <div className="flex items-center gap-1.5 flex-wrap mt-1">
                <span className={`inline-block text-[9px] font-semibold px-2 py-0.5 rounded-md border ${theme.badgeBg}`}>
                  {department}
                </span>
                {isStudent && semester && (
                  <span className="text-[9px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-md border border-slate-200">
                    Sem: {semester}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-slate-600 pt-1.5 border-t border-slate-100 mt-1">
              <div className="flex items-center gap-1">
                <HeartPulse className="w-3 h-3 text-red-500 shrink-0" />
                <span><strong className="font-semibold">Blood:</strong> {bloodGroup}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-blue-500 shrink-0" />
                <span><strong className="font-semibold">DOB:</strong> {dob}</span>
              </div>
              <div className="flex items-center gap-1 col-span-2 break-all">
                <Phone className="w-3 h-3 text-emerald-500 shrink-0" />
                <span>{phone}</span>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="shrink-0 flex flex-col items-center justify-center pl-1.5 border-l border-slate-100">
            {renderQRCode(50)}
            <span className="text-[7px] font-mono text-slate-400 mt-1 text-center font-semibold">SCAN DETAILS</span>
          </div>
        </div>
      ) : (
        /* Portrait Layout */
        <div className="flex-1 p-4 flex flex-col items-center text-center justify-between">
          <div className="w-26 h-30 rounded-xl overflow-hidden border-2 border-slate-200 shadow-md bg-slate-100 p-0.5 flex items-center justify-center -mt-1">
            <img
              src={photoUrl}
              alt={fullName}
              className="w-full h-full object-contain object-top rounded-lg"
              crossOrigin="anonymous"
            />
          </div>

          <div className="my-1.5 w-full">
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight leading-snug break-words">
              {fullName}
            </h3>
            <p className={`text-xs font-bold mt-0.5 ${theme.accentColor} break-words`}>{designation}</p>
            <div className="flex items-center justify-center gap-1.5 mt-1 flex-wrap">
              <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-md border ${theme.badgeBg}`}>
                {department}
              </span>
              <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-md">
                {displayId}
              </span>
            </div>
          </div>

          <div className="w-full grid grid-cols-2 gap-1 text-[10px] text-slate-600 py-1.5 border-y border-slate-100 text-left">
            <div>
              <span className="font-bold text-slate-800">Blood:</span> {bloodGroup}
            </div>
            <div>
              <span className="font-bold text-slate-800">DOB:</span> {dob}
            </div>
            <div className="col-span-2 break-all">
              <span className="font-bold text-slate-800">Email:</span> {email}
            </div>
          </div>

          <div className="flex items-center justify-between w-full pt-1">
            {renderQRCode(42)}
            <div className="text-right">
              <p className="text-[8px] text-slate-400 uppercase">Authorized</p>
              {signatureUrl ? (
                <img src={signatureUrl} alt="Sig" className="h-6 object-contain ml-auto" crossOrigin="anonymous" />
              ) : (
                <p className="font-serif italic text-xs font-bold text-slate-700">Authorized Signatory</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
