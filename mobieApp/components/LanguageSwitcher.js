import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { useLanguage } from '../context/LanguageContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const LanguageSwitcher = ({ visible, onClose, buttonPosition }) => {
  const { language, changeLanguage, t } = useLanguage();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const languages = [
    { code: 'en', name: t('english'), nativeName: 'English' },
    { code: 'fr', name: t('french'), nativeName: 'Français' },
    { code: 'ar', name: t('arabic'), nativeName: 'العربية' },
  ];

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleLanguageChange = async (langCode) => {
    await changeLanguage(langCode);
    onClose();
  };

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 0],
  });

  const getDropdownStyle = () => {
    if (!buttonPosition) {
      return { right: 20, top: 60 };
    }
    
    const { x, y, width, height } = buttonPosition;
    return {
      right: SCREEN_WIDTH - x - width,
      top: y + height + 8,
    };
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <Animated.View
            style={[
              styles.dropdown,
              getDropdownStyle(),
              {
                opacity: opacityAnim,
                transform: [{ translateY }],
              },
            ]}
          >
            {languages.map((lang, index) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageItem,
                  index === languages.length - 1 && styles.languageItemLast,
                  language === lang.code && styles.languageItemActive,
                ]}
                onPress={() => handleLanguageChange(lang.code)}
                activeOpacity={0.7}
              >
                <View style={styles.languageContent}>
                  <Text
                    style={[
                      styles.languageNativeName,
                      language === lang.code && styles.languageNativeNameActive,
                    ]}
                  >
                    {lang.nativeName}
                  </Text>
                  <Text
                    style={[
                      styles.languageName,
                      language === lang.code && styles.languageNameActive,
                    ]}
                  >
                    {lang.name}
                  </Text>
                </View>
                {language === lang.code && (
                  <View style={styles.checkmarkContainer}>
                    <Text style={styles.checkmark}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    minWidth: 160,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  languageItemLast: {
    borderBottomWidth: 0,
  },
  languageItemActive: {
    backgroundColor: '#FFF5F5',
  },
  languageContent: {
    flex: 1,
  },
  languageNativeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  languageNativeNameActive: {
    color: '#FF8A80',
  },
  languageName: {
    fontSize: 12,
    color: '#999',
    fontWeight: '400',
  },
  languageNameActive: {
    color: '#FF8A80',
  },
  checkmarkContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF8A80',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  checkmark: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default LanguageSwitcher;
