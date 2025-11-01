import React from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';

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

const LockIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z"
      stroke="#999"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7 11V7a5 5 0 0 1 10 0v4"
      stroke="#999"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const EyeIcon = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.eyeIcon}>
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
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
    </Svg>
  </TouchableOpacity>
);

const InputField = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  icon = 'email',
  showPasswordToggle = false,
  onTogglePassword,
  language = 'en',
  editable = true,
}) => {
  const IconComponent = icon === 'email' ? EmailIcon : LockIcon;

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <View style={styles.iconContainer}>
          <IconComponent />
        </View>
        <TextInput
          style={[styles.input, language === 'ar' && styles.inputRTL]}
          placeholder={placeholder}
          placeholderTextColor="#A0A0A0"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          editable={editable}
          textAlign={language === 'ar' ? 'right' : 'left'}
        />
        {showPasswordToggle && onTogglePassword && (
          <TouchableOpacity onPress={onTogglePassword} style={styles.eyeIconContainer}>
            <EyeIcon onPress={onTogglePassword} />
          </TouchableOpacity>
        )}
        <View style={styles.underline} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  iconContainer: {
    position: 'absolute',
    left: 0,
    top: 12,
    zIndex: 1,
  },
  input: {
    paddingLeft: 32,
    paddingRight: 32,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  inputRTL: {
    paddingLeft: 32,
    paddingRight: 32,
  },
  underline: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginTop: -1,
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 0,
    top: 12,
    zIndex: 1,
  },
  eyeIcon: {
    padding: 4,
  },
});

export default InputField;

