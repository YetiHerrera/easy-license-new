import { View, StyleSheet, useColorScheme, Pressable, ScrollView, Modal, TouchableOpacity, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, router } from 'expo-router';
import { Text } from '@/components/Text';
import { Colors } from '@/constants/Colors';
import { t } from '@/constants/i18n';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import FormInput from '@/components/auth/FormInput';
import { useData } from '@/contexts/DataContext';

// US States list
const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
  'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
  'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
  'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri',
  'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
  'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
  'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
].sort();

export default function LicenseDeliveryAddress() {
  const colorScheme = useColorScheme() || 'light';
  const theme = Colors[colorScheme];
  const { processData, updateDeliveryAddress } = useData();
  
  const [streetAddress, setStreetAddress] = useState(processData.deliveryAddress.streetAddress || '');
  const [apartment, setApartment] = useState(processData.deliveryAddress.apartment || '');
  const [city, setCity] = useState(processData.deliveryAddress.city || '');
  const [state, setState] = useState(processData.deliveryAddress.state || '');
  const [zipCode, setZipCode] = useState(processData.deliveryAddress.zipCode || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showStatePicker, setShowStatePicker] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);

  // Load saved delivery address from context
  useEffect(() => {
    if (processData.deliveryAddress) {
      setStreetAddress(processData.deliveryAddress.streetAddress || '');
      setApartment(processData.deliveryAddress.apartment || '');
      setCity(processData.deliveryAddress.city || '');
      setState(processData.deliveryAddress.state || '');
      setZipCode(processData.deliveryAddress.zipCode || '');
    }
  }, [processData.deliveryAddress]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate Street Address
    if (!streetAddress.trim()) {
      newErrors.streetAddress = t('licenseDelivery.streetAddressRequired');
    }
    
    // Validate City
    if (!city.trim()) {
      newErrors.city = t('licenseDelivery.cityRequired');
    }
    
    // Validate State
    if (!state.trim()) {
      newErrors.state = t('licenseDelivery.stateRequired');
    }
    
    // Validate ZIP Code (US format: 5 digits or 5+4)
    if (!zipCode.trim()) {
      newErrors.zipCode = t('licenseDelivery.zipCodeRequired');
    } else if (!/^\d{5}(-\d{4})?$/.test(zipCode)) {
      newErrors.zipCode = t('licenseDelivery.invalidZipCode');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      // Save delivery address to context
      await updateDeliveryAddress({
        streetAddress,
        apartment,
        city,
        state,
        zipCode,
      });
      
      // Navigate to next step
      router.push('/(authenticated)/process-review/process-type' as any);
    }
  };

  const CustomPicker = ({ 
    visible, 
    onClose, 
    items, 
    selectedValue, 
    onSelect 
  }: { 
    visible: boolean; 
    onClose: () => void; 
    items: string[]; 
    selectedValue: string; 
    onSelect: (value: string) => void;
  }) => (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={24} color={theme.text} />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalScroll}>
                {items.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.modalItem,
                      selectedValue === item && styles.modalItemSelected
                    ]}
                    onPress={() => {
                      onSelect(item);
                      onClose();
                    }}
                  >
                    <Text style={[
                      styles.modalItemText,
                      { color: theme.text },
                      selectedValue === item && styles.modalItemTextSelected
                    ]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  const isFormValid = () => {
    return (
      streetAddress.trim().length > 0 &&
      city.trim().length > 0 &&
      state.trim().length > 0 &&
      zipCode.trim().length > 0 &&
      !errors.streetAddress &&
      !errors.city &&
      !errors.state &&
      !errors.zipCode
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen
        options={{
          title: t('licenseDelivery.title'),
          headerShadowVisible: false,
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
        }}
      />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            <Text variant="title" style={[styles.title, { color: theme.primaryTitles }]}>
              {t('licenseDelivery.title')}
            </Text>
            <Text style={[styles.subtitle, { color: theme.text }]}>
              {t('licenseDelivery.subtitle')}
            </Text>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.text }]}>
                {t('licenseDelivery.state')}
              </Text>
              <Pressable
                style={[styles.pickerButton, { 
                  backgroundColor: theme.formInputBackground,
                  borderColor: theme.formInputBorder,
                }]}
                onPress={() => setShowStatePicker(true)}
              >
                <Text style={[styles.pickerButtonText, { color: theme.text }]}>
                  {state || t('licenseDelivery.statePlaceholder')}
                </Text>
                <Ionicons name="chevron-down" size={20} color={theme.text} />
              </Pressable>
              {errors.state ? (
                <Text style={[styles.errorText, { color: theme.danger }]}>
                  {errors.state}
                </Text>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.text }]}>
                {t('licenseDelivery.city')}
              </Text>
              <FormInput
                value={city}
                onChangeText={setCity}
                placeholder={t('licenseDelivery.cityPlaceholder')}
                error={errors.city}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.text }]}>
                {t('licenseDelivery.zipCode')}
              </Text>
              <FormInput
                value={zipCode}
                onChangeText={setZipCode}
                placeholder={t('licenseDelivery.zipCodePlaceholder')}
                keyboardType="numeric"
                error={errors.zipCode}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.text }]}>
                {t('licenseDelivery.streetAddress')}
              </Text>
              <FormInput
                value={streetAddress}
                onChangeText={setStreetAddress}
                placeholder={t('licenseDelivery.streetAddressPlaceholder')}
                error={errors.streetAddress}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.text }]}>
                {t('licenseDelivery.apartment')}
              </Text>
              <FormInput
                value={apartment}
                onChangeText={setApartment}
                placeholder={t('licenseDelivery.apartmentPlaceholder')}
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Pressable
            style={[
              styles.submitButton, 
              { 
                backgroundColor: isFormValid() ? theme.primary : theme.formInputBackgroundDisabled,
                opacity: isFormValid() ? 1 : 0.5,
              }
            ]}
            onPress={handleSubmit}
            disabled={!isFormValid()}
          >
            <Text style={[
              styles.submitButtonText,
              { color: isFormValid() ? '#FFFFFF' : theme.text }
            ]}>
              {t('common.continue')}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      <CustomPicker
        visible={showStatePicker}
        onClose={() => setShowStatePicker(false)}
        items={US_STATES}
        selectedValue={state}
        onSelect={setState}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  formContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 3,
  },
  label: {
    fontSize: 14,
    marginBottom: 3,
    fontWeight: '600',
  },
  pickerButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    height: 48,
    marginBottom: 15,
    borderRadius: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerButtonText: {
    fontSize: 14,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  submitButton: {
    height: 56,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalScroll: {
    maxHeight: 300,
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalItemSelected: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  modalItemText: {
    fontSize: 16,
  },
  modalItemTextSelected: {
    fontWeight: 'bold',
  }
}); 