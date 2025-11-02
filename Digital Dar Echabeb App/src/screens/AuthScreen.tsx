import React, { useState, useMemo } from 'react';
import { useApp } from '../lib/context';
import { useAuth } from '../lib/authContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../components/ui/input-otp';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ChevronRight, ChevronLeft, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import wilayaCommunesData from '../data/wilaya_communes.json';

interface AuthScreenProps {
  onComplete: () => void;
}

// Algerian wilayas and communes data
const wilayas = [
  { id: '01', name: 'Adrar', nameAr: 'أدرار' },
  { id: '02', name: 'Chlef', nameAr: 'الشلف' },
  { id: '03', name: 'Laghouat', nameAr: 'الأغواط' },
  { id: '04', name: 'Oum El Bouaghi', nameAr: 'أم البواقي' },
  { id: '05', name: 'Batna', nameAr: 'باتنة' },
  { id: '06', name: 'Béjaïa', nameAr: 'بجاية' },
  { id: '07', name: 'Biskra', nameAr: 'بسكرة' },
  { id: '08', name: 'Béchar', nameAr: 'بشار' },
  { id: '09', name: 'Blida', nameAr: 'البليدة' },
  { id: '10', name: 'Bouira', nameAr: 'البويرة' },
  { id: '11', name: 'Tamanrasset', nameAr: 'تمنراست' },
  { id: '12', name: 'Tébessa', nameAr: 'تبسة' },
  { id: '13', name: 'Tlemcen', nameAr: 'تلمسان' },
  { id: '14', name: 'Tiaret', nameAr: 'تيارت' },
  { id: '15', name: 'Tizi Ouzou', nameAr: 'تيزي وزو' },
  { id: '16', name: 'Algiers', nameAr: 'الجزائر' },
  { id: '17', name: 'Djelfa', nameAr: 'الجلفة' },
  { id: '18', name: 'Jijel', nameAr: 'جيجل' },
  { id: '19', name: 'Sétif', nameAr: 'سطيف' },
  { id: '20', name: 'Saïda', nameAr: 'سعيدة' },
  { id: '21', name: 'Skikda', nameAr: 'سكيكدة' },
  { id: '22', name: 'Sidi Bel Abbès', nameAr: 'سيدي بلعباس' },
  { id: '23', name: 'Annaba', nameAr: 'عنابة' },
  { id: '24', name: 'Guelma', nameAr: 'قالمة' },
  { id: '25', name: 'Constantine', nameAr: 'قسنطينة' },
  { id: '26', name: 'Médéa', nameAr: 'المدية' },
  { id: '27', name: 'Mostaganem', nameAr: 'مستغانم' },
  { id: '28', name: "M'Sila", nameAr: 'المسيلة' },
  { id: '29', name: 'Mascara', nameAr: 'معسكر' },
  { id: '30', name: 'Ouargla', nameAr: 'ورقلة' },
  { id: '31', name: 'Oran', nameAr: 'وهران' },
  { id: '32', name: 'El Bayadh', nameAr: 'البيض' },
  { id: '33', name: 'Illizi', nameAr: 'إليزي' },
  { id: '34', name: 'Bordj Bou Arréridj', nameAr: 'برج بوعريريج' },
  { id: '35', name: 'Boumerdès', nameAr: 'بومرداس' },
  { id: '36', name: 'El Tarf', nameAr: 'الطارف' },
  { id: '37', name: 'Tindouf', nameAr: 'تندوف' },
  { id: '38', name: 'Tissemsilt', nameAr: 'تيسمسيلت' },
  { id: '39', name: 'El Oued', nameAr: 'الوادي' },
  { id: '40', name: 'Khenchela', nameAr: 'خنشلة' },
  { id: '41', name: 'Souk Ahras', nameAr: 'سوق أهراس' },
  { id: '42', name: 'Tipaza', nameAr: 'تيبازة' },
  { id: '43', name: 'Mila', nameAr: 'ميلة' },
  { id: '44', name: 'Aïn Defla', nameAr: 'عين الدفلى' },
  { id: '45', name: 'Naâma', nameAr: 'النعامة' },
  { id: '46', name: 'Aïn Témouchent', nameAr: 'عين تموشنت' },
  { id: '47', name: 'Ghardaïa', nameAr: 'غرداية' },
  { id: '48', name: 'Relizane', nameAr: 'غليزان' },
];

// Type for wilaya communes data
type WilayaCommunesData = {
  [wilayaName: string]: string[];
};

export function AuthScreen({ onComplete }: AuthScreenProps) {
  const { t, language } = useApp();
  const { login, register } = useAuth();
  const [showOTP, setShowOTP] = useState(false);
  const [email, setEmail] = useState('');
  const [signupStep, setSignupStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  
  // Step 1 fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  
  // Step 2 fields
  const [wilaya, setWilaya] = useState('');
  const [commune, setCommune] = useState('');
  const [address, setAddress] = useState('');
  
  // Step 3 fields
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Get communes based on selected wilaya from JSON data
  const availableCommunes = useMemo(() => {
    if (!wilaya) return [];
    
    const selectedWilaya = wilayas.find(w => w.id === wilaya);
    if (!selectedWilaya) return [];
    
    // Get Arabic name to match JSON keys
    const wilayaNameAr = selectedWilaya.nameAr;
    
    // Get communes from JSON data using Arabic wilaya name
    const communesData = wilayaCommunesData as WilayaCommunesData;
    const communes = communesData[wilayaNameAr] || [];
    
    return communes.sort(); // Sort alphabetically
  }, [wilaya]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !loginPassword) {
      toast.error(t('الرجاء إدخال البريد الإلكتروني وكلمة المرور', 'Please enter email and password'));
      return;
    }

    setIsLoading(true);
    try {
      await login({ email, password: loginPassword });
      toast.success(t('تم تسجيل الدخول بنجاح', 'Login successful'));
      onComplete();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('فشل تسجيل الدخول', 'Login failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupStep(2);
  };

  const handleSignupStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupStep(3);
  };

  const handleSignupStep3 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error(t('كلمات المرور غير متطابقة', 'Passwords do not match'));
      return;
    }

    if (!firstName || !lastName || !dateOfBirth || !wilaya || !commune || !address || !phone || !email || !password) {
      toast.error(t('الرجاء ملء جميع الحقول', 'Please fill all fields'));
      return;
    }

    setIsLoading(true);
    try {
      // Map wilaya ID to name for backend
      const selectedWilaya = wilayas.find(w => w.id === wilaya);
      const wilayaName = selectedWilaya ? (language === 'ar' ? selectedWilaya.nameAr : selectedWilaya.name) : wilaya;

      await register({
        nom: lastName,
        prenom: firstName,
        date_de_naissance: dateOfBirth,
        adresse: address,
        commune: commune,
        wilaya: wilayaName,
        numero_telephone: phone,
        email: email,
        password: password,
        password_confirmation: confirmPassword,
      });
      
      toast.success(t('تم إنشاء الحساب بنجاح', 'Account created successfully'));
      // New users should go to interests selection screen
      // onComplete will handle navigation
      onComplete();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('فشل إنشاء الحساب', 'Registration failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPComplete = () => {
    onComplete();
  };

  if (showOTP) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-8 bg-background">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <h2>{t('تأكيد البريد الإلكتروني', 'Verify Email')}</h2>
            <p className="text-muted-foreground">
              {t('أدخل الرمز المرسل إلى', 'Enter code sent to')} {email}
            </p>
          </div>

          <div className="flex justify-center">
            <InputOTP maxLength={6} onComplete={handleOTPComplete}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button onClick={handleOTPComplete} className="w-full" size="lg">
            {t('تأكيد', 'Verify')}
          </Button>

          <button
            onClick={() => setShowOTP(false)}
            className="w-full text-center text-primary"
          >
            {t('تغيير البريد الإلكتروني', 'Change Email')}
          </button>
        </div>
      </div>
    );
  }

  const isRTL = language === 'ar';

  return (
    <div className="h-screen flex flex-col items-center justify-center p-8 bg-background">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1>{t('دار الشباب الرقمية', 'Digital Youth Center')}</h1>
          <p className="text-muted-foreground">
            {t('انضم إلى مجتمع الشباب اليوم', 'Join the youth community today')}
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">{t('تسجيل الدخول', 'Login')}</TabsTrigger>
            <TabsTrigger value="signup">{t('حساب جديد', 'Sign Up')}</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">{t('البريد الإلكتروني', 'Email')}</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="ahmed@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">{t('كلمة المرور', 'Password')}</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="button"
                className="text-sm text-primary"
              >
                {t('نسيت كلمة المرور؟', 'Forgot Password?')}
              </button>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t('جاري تسجيل الدخول...', 'Logging in...')}
                  </>
                ) : (
                  t('دخول', 'Login')
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            {/* Step Progress Indicator */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${signupStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  {signupStep > 1 ? <Check className="h-4 w-4" /> : '1'}
                </div>
                <div className={`h-1 flex-1 ${signupStep >= 2 ? 'bg-primary' : 'bg-muted'}`} />
              </div>
              <div className="flex items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${signupStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  {signupStep > 2 ? <Check className="h-4 w-4" /> : '2'}
                </div>
                <div className={`h-1 flex-1 ${signupStep >= 3 ? 'bg-primary' : 'bg-muted'}`} />
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${signupStep >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                3
              </div>
            </div>

            {/* Step 1: Personal Information */}
            {signupStep === 1 && (
              <form onSubmit={handleSignupStep1} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">{t('الاسم الأول', 'First Name')}</Label>
                  <Input
                    id="first-name"
                    type="text"
                    placeholder={t('أحمد', 'Ahmed')}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last-name">{t('اسم العائلة', 'Last Name')}</Label>
                  <Input
                    id="last-name"
                    type="text"
                    placeholder={t('محمد', 'Mohamed')}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob">{t('تاريخ الميلاد', 'Date of Birth')}</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    required
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <Button type="submit" className="w-full" size="lg">
                  {t('التالي', 'Next')}
                  {isRTL ? <ChevronLeft className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4 ml-2" />}
                </Button>
              </form>
            )}

            {/* Step 2: Location Information */}
            {signupStep === 2 && (
              <form onSubmit={handleSignupStep2} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="wilaya">{t('الولاية', 'Wilaya')}</Label>
                  <Select value={wilaya} onValueChange={(value) => { setWilaya(value); setCommune(''); }}>
                    <SelectTrigger id="wilaya">
                      <SelectValue placeholder={t('اختر الولاية', 'Select Wilaya')} />
                    </SelectTrigger>
                    <SelectContent>
                      {wilayas.map((w) => (
                        <SelectItem key={w.id} value={w.id}>
                          {language === 'ar' ? w.nameAr : w.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="commune">{t('البلدية', 'Commune')}</Label>
                  <Select value={commune} onValueChange={setCommune} disabled={!wilaya}>
                    <SelectTrigger id="commune">
                      <SelectValue placeholder={t('اختر البلدية', 'Select Commune')} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCommunes.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">{t('العنوان', 'Address')}</Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder={t('حي، شارع، رقم', 'District, Street, Number')}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSignupStep(1)}
                    className="flex-1"
                  >
                    {isRTL ? <ChevronRight className="h-4 w-4 ml-2" /> : <ChevronLeft className="h-4 w-4 mr-2" />}
                    {t('السابق', 'Back')}
                  </Button>
                  <Button type="submit" className="flex-1" size="lg">
                    {t('التالي', 'Next')}
                    {isRTL ? <ChevronLeft className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4 ml-2" />}
                  </Button>
                </div>
              </form>
            )}

            {/* Step 3: Account Information */}
            {signupStep === 3 && (
              <form onSubmit={handleSignupStep3} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">{t('البريد الإلكتروني', 'Email')}</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="ahmed@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-phone">{t('رقم الهاتف', 'Phone Number')}</Label>
                  <Input
                    id="signup-phone"
                    type="tel"
                    placeholder="+213 555 123 456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">{t('كلمة المرور', 'Password')}</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">{t('تأكيد كلمة المرور', 'Confirm Password')}</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSignupStep(2)}
                    className="flex-1"
                  >
                    {isRTL ? <ChevronRight className="h-4 w-4 ml-2" /> : <ChevronLeft className="h-4 w-4 mr-2" />}
                    {t('السابق', 'Back')}
                  </Button>
                  <Button type="submit" className="flex-1" size="lg" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {t('جاري الإنشاء...', 'Creating...')}
                      </>
                    ) : (
                      t('إنشاء حساب', 'Create Account')
                    )}
                  </Button>
                </div>
              </form>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
