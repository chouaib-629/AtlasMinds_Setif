import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  I18nManager,
  Animated,
  Modal,
  Pressable,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import WaveSeparator from '../components/WaveSeparator';
import CustomDropdown from '../components/CustomDropdown';
import { getWilayas, getCommunesByWilaya } from '../utils/wilayaData';
import Svg, { Path } from 'react-native-svg';

// Get maximum date (current year - 6, minimum age 6)
const getMaxDate = () => {
  const today = new Date();
  const maxYear = today.getFullYear() - 6;
  return new Date(maxYear, 11, 31); // December 31 of (current year - 6)
};

const RegisterScreen = ({ navigation }) => {
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // Form data
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  // Initialize with a default date (10 years ago)
  const [dateNaissance, setDateNaissance] = useState(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 10);
    return date;
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [adresse, setAdresse] = useState('');
  const [selectedWilaya, setSelectedWilaya] = useState('');
  const [selectedCommune, setSelectedCommune] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [numeroTelephone, setNumeroTelephone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [buttonPosition, setButtonPosition] = useState(null);
  const languageButtonRef = useRef(null);

  const { register } = useAuth();
  const { t, language } = useLanguage();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  const wilayas = getWilayas();
  const communes = selectedWilaya ? getCommunesByWilaya(selectedWilaya) : [];

  useEffect(() => {
    // Reset commune when wilaya changes
    if (selectedWilaya && !communes.includes(selectedCommune)) {
      setSelectedCommune('');
    }
  }, [selectedWilaya]);

  useEffect(() => {
    // Force RTL layout for Arabic
    if (language === 'ar' && !I18nManager.isRTL) {
      I18nManager.forceRTL(true);
      I18nManager.allowRTL(true);
    } else if (language !== 'ar' && I18nManager.isRTL) {
      I18nManager.forceRTL(false);
      I18nManager.allowRTL(false);
    }

    // Welcome animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }),
    ]).start();
  }, [language]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDateDisplay = (date) => {
    return date.toLocaleDateString(language === 'ar' ? 'ar-DZ' : language === 'fr' ? 'fr-FR' : 'en-US');
  };

  const validateStep1 = () => {
    if (!nom.trim()) {
      Alert.alert(t('error'), `${t('nom')} ${t('fillAllFields')}`);
      return false;
    }
    if (!prenom.trim()) {
      Alert.alert(t('error'), `${t('prenom')} ${t('fillAllFields')}`);
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!adresse.trim()) {
      Alert.alert(t('error'), `${t('adresse')} ${t('fillAllFields')}`);
      return false;
    }
    if (!selectedWilaya) {
      Alert.alert(t('error'), t('selectWilaya'));
      return false;
    }
    if (!selectedCommune) {
      Alert.alert(t('error'), t('selectCommune'));
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!email.trim() || !email.includes('@')) {
      Alert.alert(t('error'), t('validEmail'));
      return false;
    }
    if (!numeroTelephone.trim()) {
      Alert.alert(t('error'), `${t('numeroTelephone')} ${t('fillAllFields')}`);
      return false;
    }
    if (password.length < 8) {
      Alert.alert(t('error'), t('passwordMinLength'));
      return false;
    }
    if (password !== passwordConfirmation) {
      Alert.alert(t('error'), t('passwordsDontMatch'));
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (validateStep2()) {
        setCurrentStep(3);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.navigate('Login');
    }
  };

  const handleRegister = async () => {
    if (!validateStep3()) {
      return;
    }

    setLoading(true);
    try {
      const registerData = {
        nom: nom.trim(),
        prenom: prenom.trim(),
        date_de_naissance: formatDate(dateNaissance),
        adresse: adresse.trim(),
        commune: selectedCommune,
        wilaya: selectedWilaya,
        numero_telephone: numeroTelephone.trim(),
        email: email.trim(),
        password: password,
        password_confirmation: passwordConfirmation,
      };

      console.log('Registering with data:', registerData); // Debug log

      const result = await register(registerData);
      if (result.success) {
        Alert.alert(t('success'), result.message || t('registrationSuccessful'));
      } else {
        if (result.errors) {
          // Format errors better
          const errorMessages = Object.entries(result.errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('\n');
          Alert.alert(t('registrationFailed'), errorMessages || result.message);
        } else {
          Alert.alert(t('registrationFailed'), result.message);
        }
      }
    } catch (error) {
      console.error('Registration error:', error); // Debug log
      const errorMessage = error.response?.data?.message || error.message || t('unexpectedError');
      const errorDetails = error.response?.data?.errors;
      if (errorDetails) {
        const errorMessages = Object.entries(errorDetails)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('\n');
        Alert.alert(t('error'), errorMessages);
      } else {
        Alert.alert(t('error'), errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const EyeIcon = ({ visible }) => (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      {visible ? (
        <>
          <Path
            d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
            stroke="#999"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"
            stroke="#999"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <>
          <Path
            d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
            stroke="#999"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path d="M1 1l22 22" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
    </Svg>
  );

  const renderStepIndicator = () => {
    return (
      <View style={styles.stepIndicator}>
        {[1, 2, 3].map((step) => (
          <View key={step} style={styles.stepContainer}>
            <View
              style={[
                styles.stepCircle,
                currentStep >= step && styles.stepCircleActive,
              ]}
            >
              {currentStep > step ? (
                <Text style={styles.stepCheckmark}>✓</Text>
              ) : (
                <Text
                  style={[
                    styles.stepNumber,
                    currentStep >= step && styles.stepNumberActive,
                  ]}
                >
                  {step}
                </Text>
              )}
            </View>
            {step < totalSteps && (
              <View
                style={[
                  styles.stepLine,
                  currentStep > step && styles.stepLineActive,
                ]}
              />
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderStep1 = () => (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text style={styles.stepTitle}>{t('step1Title')}</Text>

      {/* Nom */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('nom')} *</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, language === 'ar' && styles.inputRTL]}
            placeholder={t('enterName')}
            placeholderTextColor="#A0A0A0"
            value={nom}
            onChangeText={setNom}
            autoCapitalize="words"
            editable={!loading}
            textAlign={language === 'ar' ? 'right' : 'left'}
          />
          <View style={styles.underline} />
        </View>
      </View>

      {/* Prénom */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('prenom')} *</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, language === 'ar' && styles.inputRTL]}
            placeholder={t('enterName')}
            placeholderTextColor="#A0A0A0"
            value={prenom}
            onChangeText={setPrenom}
            autoCapitalize="words"
            editable={!loading}
            textAlign={language === 'ar' ? 'right' : 'left'}
          />
          <View style={styles.underline} />
        </View>
      </View>

      {/* Date de naissance */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('dateDeNaissance')} *</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => {
            if (Platform.OS === 'web') {
              // For web, create a native HTML date input
              const input = document.createElement('input');
              input.type = 'date';
              input.value = formatDate(dateNaissance);
              input.max = formatDate(getMaxDate());
              input.min = '1900-01-01';
              input.style.position = 'fixed';
              input.style.opacity = '0';
              input.style.pointerEvents = 'none';
              document.body.appendChild(input);
              input.showPicker();
              input.onchange = (e) => {
                if (e.target.value) {
                  const date = new Date(e.target.value);
                  if (!isNaN(date.getTime())) {
                    setDateNaissance(date);
                  }
                }
                document.body.removeChild(input);
              };
              input.onblur = () => {
                if (document.body.contains(input)) {
                  document.body.removeChild(input);
                }
              };
            } else {
              console.log('Date picker button pressed');
              setShowDatePicker(true);
            }
          }}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.dateText,
              !dateNaissance && styles.placeholderText,
            ]}
          >
            {formatDateDisplay(dateNaissance)}
          </Text>
        </TouchableOpacity>
        {Platform.OS === 'ios' && (
          <Modal
            visible={showDatePicker}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowDatePicker(false)}
          >
            <Pressable
              style={styles.modalOverlay}
              onPress={() => setShowDatePicker(false)}
            >
              <Pressable style={styles.datePickerContainer} onPress={(e) => e.stopPropagation()}>
                <View style={styles.datePickerHeader}>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(false)}
                    style={styles.datePickerButton}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.datePickerButtonText}>{t('confirm')}</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={dateNaissance}
                  mode="date"
                  display="spinner"
                  maximumDate={getMaxDate()}
                  minimumDate={new Date(1900, 0, 1)}
                  onChange={(event, selectedDate) => {
                    const currentDate = selectedDate || dateNaissance;
                    setDateNaissance(currentDate);
                  }}
                  textColor="#333"
                />
              </Pressable>
            </Pressable>
          </Modal>
        )}
        {Platform.OS === 'android' && showDatePicker && (
          <DateTimePicker
            value={dateNaissance}
            mode="date"
            display="default"
            maximumDate={getMaxDate()}
            minimumDate={new Date(1900, 0, 1)}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (event.type === 'set' && selectedDate) {
                setDateNaissance(selectedDate);
              }
            }}
          />
        )}
      </View>
    </Animated.View>
  );

  const renderStep2 = () => (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text style={styles.stepTitle}>{t('step2Title')}</Text>

      {/* Adresse */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('adresse')} *</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, styles.textArea, language === 'ar' && styles.inputRTL]}
            placeholder={t('enterAddress')}
            placeholderTextColor="#A0A0A0"
            value={adresse}
            onChangeText={setAdresse}
            multiline
            numberOfLines={3}
            editable={!loading}
            textAlign={language === 'ar' ? 'right' : 'left'}
          />
          <View style={styles.underline} />
        </View>
      </View>

      {/* Wilaya */}
      <CustomDropdown
        label={`${t('wilaya')} *`}
        options={wilayas}
        selectedValue={selectedWilaya}
        onSelect={setSelectedWilaya}
        placeholder={t('selectWilaya')}
        language={language}
      />

      {/* Commune */}
      <CustomDropdown
        label={`${t('commune')} *`}
        options={communes}
        selectedValue={selectedCommune}
        onSelect={setSelectedCommune}
        placeholder={
          !selectedWilaya
            ? t('selectWilayaFirst')
            : t('selectCommune')
        }
        language={language}
      />
    </Animated.View>
  );

  const renderStep3 = () => (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text style={styles.stepTitle}>{t('step3Title')}</Text>

      {/* Email */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('email')} *</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, language === 'ar' && styles.inputRTL]}
            placeholder={t('enterEmail')}
            placeholderTextColor="#A0A0A0"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
            textAlign={language === 'ar' ? 'right' : 'left'}
          />
          <View style={styles.underline} />
        </View>
      </View>

      {/* Numéro de téléphone */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('numeroTelephone')} *</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, language === 'ar' && styles.inputRTL]}
            placeholder={t('enterPhone')}
            placeholderTextColor="#A0A0A0"
            value={numeroTelephone}
            onChangeText={setNumeroTelephone}
            keyboardType="phone-pad"
            editable={!loading}
            textAlign={language === 'ar' ? 'right' : 'left'}
          />
          <View style={styles.underline} />
        </View>
      </View>

      {/* Password */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('password')} *</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, language === 'ar' && styles.inputRTL]}
            placeholder={t('enterPasswordMin')}
            placeholderTextColor="#A0A0A0"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            editable={!loading}
            textAlign={language === 'ar' ? 'right' : 'left'}
          />
          <TouchableOpacity
            style={styles.iconRight}
            onPress={() => setShowPassword(!showPassword)}
          >
            <EyeIcon visible={showPassword} />
          </TouchableOpacity>
          <View style={styles.underline} />
        </View>
      </View>

      {/* Confirm Password */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('confirmPassword')} *</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, language === 'ar' && styles.inputRTL]}
            placeholder={t('confirmPasswordPlaceholder')}
            placeholderTextColor="#A0A0A0"
            value={passwordConfirmation}
            onChangeText={setPasswordConfirmation}
            secureTextEntry={!showPasswordConfirmation}
            autoCapitalize="none"
            editable={!loading}
            textAlign={language === 'ar' ? 'right' : 'left'}
          />
          <TouchableOpacity
            style={styles.iconRight}
            onPress={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
          >
            <EyeIcon visible={showPasswordConfirmation} />
          </TouchableOpacity>
          <View style={styles.underline} />
        </View>
      </View>
    </Animated.View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Header with coral background */}
      <View style={styles.headerSection}>
        <TouchableOpacity
          ref={languageButtonRef}
          style={styles.languageButton}
          onPress={() => {
            languageButtonRef.current?.measure((x, y, width, height, pageX, pageY) => {
              setButtonPosition({ x: pageX, y: pageY, width, height });
              setLanguageModalVisible(true);
            });
          }}
        >
          <Text style={styles.languageButtonText}>
            {language === 'en' ? 'EN' : language === 'fr' ? 'FR' : 'AR'}
          </Text>
        </TouchableOpacity>
        <Animated.View
          style={[
            styles.waveContainer,
            {
              opacity: waveAnim,
              transform: [
                {
                  translateY: waveAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <WaveSeparator color="#FFFFFF" />
        </Animated.View>
      </View>

      {/* White content section */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>{t('createAccount')}</Text>
          {renderStepIndicator()}

          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          {/* Navigation Buttons */}
          <View style={styles.navigationButtons}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
              disabled={loading}
            >
              <Text style={styles.backButtonText}>
                {currentStep === 1 ? t('cancel') : t('previous')}
              </Text>
            </TouchableOpacity>

            {currentStep < totalSteps ? (
              <TouchableOpacity
                style={styles.nextButton}
                onPress={handleNext}
                disabled={loading}
              >
                <Text style={styles.nextButtonText}>{t('next')}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.registerButton, loading && styles.registerButtonDisabled]}
                onPress={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.registerButtonText}>{t('signUp')}</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      <LanguageSwitcher
        visible={languageModalVisible}
        onClose={() => setLanguageModalVisible(false)}
        buttonPosition={buttonPosition}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerSection: {
    height: '40%',
    backgroundColor: '#FF8A80',
    position: 'relative',
    overflow: 'hidden',
  },
  waveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  languageButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 20,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  languageButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  formContainer: {
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 32,
    textAlign: 'left',
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleActive: {
    backgroundColor: '#FF8A80',
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#999',
  },
  stepNumberActive: {
    color: '#fff',
  },
  stepCheckmark: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  stepLineActive: {
    backgroundColor: '#FF8A80',
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputRTL: {
    textAlign: 'right',
  },
  underline: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginTop: 4,
  },
  iconRight: {
    position: 'absolute',
    right: 0,
    top: 12,
    zIndex: 1,
    padding: 4,
  },
  dateButton: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    minHeight: 44,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    color: '#A0A0A0',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  datePickerContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 8,
  },
  datePickerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  datePickerButtonText: {
    color: '#FF8A80',
    fontSize: 16,
    fontWeight: '600',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
    gap: 12,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  backButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#FF8A80',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#FF8A80',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  registerButton: {
    flex: 1,
    backgroundColor: '#FF8A80',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#FF8A80',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default RegisterScreen;
