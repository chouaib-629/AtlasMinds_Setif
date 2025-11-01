import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

const HomeScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { t, language } = useLanguage();
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [buttonPosition, setButtonPosition] = useState(null);
  const languageButtonRef = useRef(null);

  const handleLogout = async () => {
    await logout();
  };

  const getLanguageDisplay = () => {
    const langMap = {
      en: 'EN',
      fr: 'FR',
      ar: 'AR',
    };
    return langMap[language] || 'EN';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
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
          <Text style={styles.languageButtonText}>{getLanguageDisplay()}</Text>
        </TouchableOpacity>

        <Text style={styles.title}>{t('welcome')}!</Text>
        <Text style={styles.subtitle}>{t('youAreLoggedIn')}</Text>
        
        {user && (
          <View style={styles.userInfo}>
            <Text style={styles.userLabel}>{t('name')}:</Text>
            <Text style={styles.userValue}>{user.name}</Text>
            
            <Text style={styles.userLabel}>{t('email')}:</Text>
            <Text style={styles.userValue}>{user.email}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>{t('logout')}</Text>
        </TouchableOpacity>
      </View>

      <LanguageSwitcher
        visible={languageModalVisible}
        onClose={() => setLanguageModalVisible(false)}
        buttonPosition={buttonPosition}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  languageButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  languageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  userInfo: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
  },
  userLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  userValue: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default HomeScreen;

