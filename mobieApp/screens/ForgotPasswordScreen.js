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
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import WaveSeparator from '../components/WaveSeparator';
import Svg, { Path } from 'react-native-svg';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [buttonPosition, setButtonPosition] = useState(null);
  const languageButtonRef = useRef(null);
  const { forgotPassword } = useAuth();
  const { t, language } = useLanguage();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

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

  const handleSendResetLink = async () => {
    if (!email.trim()) {
      Alert.alert(t('error'), t('enterEmail'));
      return;
    }

    if (!email.includes('@')) {
      Alert.alert(t('error'), t('validEmail'));
      return;
    }

    setLoading(true);
    try {
      const result = await forgotPassword(email.trim());
      if (result.success) {
        setEmailSent(true);
        Alert.alert(t('success'), result.message || t('resetLinkSent'));
      } else {
        Alert.alert(t('error'), result.message || t('unexpectedError'));
      }
    } catch (error) {
      Alert.alert(t('error'), t('unexpectedError'));
    } finally {
      setLoading(false);
    }
  };

  const EmailIcon = () => (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
        stroke="#999"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M22 6l-10 7L2 6"
        stroke="#999"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  if (emailSent) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
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
          <WaveSeparator color="#FFFFFF" />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Animated.View
            style={[
              styles.successContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.successIconContainer}>
              <Text style={styles.successIcon}>✓</Text>
            </View>
            <Text style={styles.successTitle}>{t('checkEmail')}</Text>
            <Text style={styles.successMessage}>
              {t('resetLinkSent')} {email}. {t('checkInbox')}
            </Text>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.backButtonText}>{t('backToLogin')}</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>

        <LanguageSwitcher
          visible={languageModalVisible}
          onClose={() => setLanguageModalVisible(false)}
          buttonPosition={buttonPosition}
        />
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Header with coral background */}
      <View style={styles.headerSection}>
        <TouchableOpacity
          style={styles.languageButton}
          onPress={() => setLanguageModalVisible(true)}
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
        <Animated.View
          style={[
            styles.formContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.title}>{t('forgotPasswordTitle')}</Text>
          <Text style={styles.subtitle}>{t('forgotPasswordSubtitle')}</Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('email')}</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.iconLeft}>
                <EmailIcon />
              </View>
              <TextInput
                style={[styles.input, language === 'ar' && styles.inputRTL]}
                placeholder="demo@email.com"
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

          {/* Send Reset Link Button */}
          <TouchableOpacity
            style={[styles.sendButton, loading && styles.sendButtonDisabled]}
            onPress={handleSendResetLink}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.sendButtonText}>{t('sendResetLink')}</Text>
            )}
          </TouchableOpacity>

          {/* Back to Login Link */}
          <TouchableOpacity
            style={styles.backToLoginButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.backToLoginText}>{t('backToLogin')}</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      <LanguageSwitcher
        visible={languageModalVisible}
        onClose={() => setLanguageModalVisible(false)}
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
    justifyContent: 'center',
  },
  formContainer: {
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'left',
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: 32,
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
  iconLeft: {
    position: 'absolute',
    left: 0,
    top: 12,
    zIndex: 1,
  },
  input: {
    paddingLeft: 32,
    paddingRight: 0,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  inputRTL: {
    paddingLeft: 0,
    paddingRight: 32,
  },
  underline: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginTop: 4,
  },
  sendButton: {
    backgroundColor: '#FF8A80',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
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
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  backToLoginButton: {
    alignSelf: 'center',
    paddingVertical: 10,
  },
  backToLoginText: {
    color: '#FF8A80',
    fontSize: 15,
    fontWeight: '600',
  },
  successContainer: {
    alignItems: 'center',
    padding: 20,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successIcon: {
    fontSize: 48,
    color: '#fff',
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  backButton: {
    backgroundColor: '#FF8A80',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 40,
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
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default ForgotPasswordScreen;
