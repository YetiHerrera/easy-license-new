import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Modal, FlatList, Text, useColorScheme } from 'react-native';
import { t } from '../../constants/i18n';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

// Country codes for Guatemala and United States
const COUNTRY_CODES = [
  { code: '+502', flag: '🇬🇹', name: 'Guatemala' },
  { code: '+1', flag: '🇺🇸', name: 'United States' }
];

interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onChangeCountryCode: (code: string) => void;
  countryCode: string;
  placeholder?: string;
  error?: string;
}

const PhoneInput = ({
  value,
  onChangeText,
  onChangeCountryCode,
  countryCode,
  placeholder,
  error
}: PhoneInputProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const colorScheme = useColorScheme() || 'light';
  const theme = Colors[colorScheme];
  
  // Find the selected country by code
  const selectedCountry = COUNTRY_CODES.find(country => country.code === countryCode) || COUNTRY_CODES[0];

  return (
    <View style={styles.container}>
      <View style={[
        styles.mainContainer,
        {
          backgroundColor: theme.formInputBackground,
          borderColor: theme.formInputBorder,
        }
      ]}>
        <TouchableOpacity
          style={styles.countryCodeContainer}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.flag}>{selectedCountry.flag}</Text>
          <Text style={[styles.countryCode, { color: theme.text }]}>{selectedCountry.code}</Text>
          <Ionicons name="chevron-down" size={16} color={theme.icon} style={styles.codeIcon} />
        </TouchableOpacity>

        <View style={styles.separator} />

        <TextInput
          style={[
            styles.input,
            { color: theme.text }
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder || t('auth.phoneNumber')}
          placeholderTextColor={theme.placeholderTextColor}
          keyboardType="phone-pad"
        />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>{t('auth.countryCode')}</Text>
            <FlatList
              data={COUNTRY_CODES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.countryItem, { borderBottomColor: colorScheme === 'light' ? '#f0f0f0' : '#2c2c2e' }]}
                  onPress={() => {
                    onChangeCountryCode(item.code);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.flag}>{item.flag}</Text>
                  <Text style={[styles.countryName, { color: theme.text }]}>{item.name}</Text>
                  <Text style={[styles.countryCodeItem, { color: colorScheme === 'light' ? '#666' : '#8E8E93' }]}>{item.code}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colorScheme === 'light' ? '#f0f0f0' : '#2c2c2e' }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.closeButtonText, { color: theme.text }]}>{t('common.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {error ? <Text style={[styles.errorText, { color: theme.danger }]}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  codeIcon: {
    marginLeft: 4,
  },
  separator: {
    height: '70%',
    width: 1,
    backgroundColor: '#C7C7CC',
  },
  flag: {
    fontSize: 20,
    marginRight: 8,
  },
  countryCode: {
    fontSize: 16,
  },
  input: {
    flex: 1,
    padding: 8,
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    borderRadius: 10,
    padding: 20,
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
  },
  countryName: {
    flex: 1,
    fontSize: 16,
  },
  countryCodeItem: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 16,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default PhoneInput; 