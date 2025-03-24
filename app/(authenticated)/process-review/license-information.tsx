import { View, StyleSheet, useColorScheme, Pressable, ScrollView, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Stack, router } from 'expo-router';
import { Text } from '@/components/Text';
import { Colors } from '@/constants/Colors';
import { t } from '@/constants/i18n';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import FormInput from '@/components/auth/FormInput';

type LicenseType = 'A' | 'B' | 'C' | 'M' | 'E';

const LICENSE_TYPES: LicenseType[] = ['A', 'B', 'C', 'M', 'E'];
const RENEWAL_YEARS = [1, 2, 3, 4, 5];

export default function LicenseInformation() {
  const colorScheme = useColorScheme() || 'light';
  const theme = Colors[colorScheme];
  
  const [dpi, setDpi] = useState('');
  const [names, setNames] = useState('');
  const [lastNames, setLastNames] = useState('');
  const [licenseType, setLicenseType] = useState<LicenseType>('A');
  const [renewalYears, setRenewalYears] = useState('1');
  const [bornDate, setBornDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showLicenseTypePicker, setShowLicenseTypePicker] = useState(false);
  const [showRenewalYearsPicker, setShowRenewalYearsPicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleDateChange = (date: Date) => {
    setBornDate(date);
    setShowDatePicker(false);
    // Clear error if exists
    if (errors.bornDate) {
      setErrors({...errors, bornDate: ''});
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate DPI/Passport (should be 13 digits for DPI or 8-12 characters for passport)
    if (!dpi) {
      newErrors.dpi = t('licenseInformation.dpiRequired');
    } else if (dpi.length >= 8 && dpi.length <= 12) {
        // Valid passport format
    } else if (dpi.length === 13 && /^\d+$/.test(dpi)) {
      // Valid DPI format
    } else {
      newErrors.dpi = t('licenseInformation.invalidDpi');
    }
    
    // Validate Names
    if (!names.trim()) {
      newErrors.names = t('licenseInformation.nameRequired');
    }
    
    // Validate Last Names
    if (!lastNames.trim()) {
      newErrors.lastNames = t('licenseInformation.lastNameRequired');
    }
    
    // Validate Date of Birth (user must be at least 18 years old)
    const today = new Date();
    const age = today.getFullYear() - bornDate.getFullYear();
    const monthDiff = today.getMonth() - bornDate.getMonth();
    
    if (age < 18 || (age === 18 && monthDiff < 0) || 
        (age === 18 && monthDiff === 0 && today.getDate() < bornDate.getDate())) {
      newErrors.bornDate = t('licenseInformation.ageRestriction');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Here you would submit the form data
      console.log({
        dpi,
        names,
        lastNames,
        licenseType,
        renewalYears,
        bornDate,
      });
      // Navigate to next step
      router.push('/(authenticated)/process-review/payment' as any);
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
    items: string[] | number[]; 
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
                      selectedValue === item.toString() && styles.modalItemSelected
                    ]}
                    onPress={() => {
                      onSelect(item.toString());
                      onClose();
                    }}
                  >
                    <Text style={[
                      styles.modalItemText,
                      { color: theme.text },
                      selectedValue === item.toString() && styles.modalItemTextSelected
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

  const CustomDatePicker = ({ 
    visible, 
    onClose, 
    value, 
    onChange 
  }: { 
    visible: boolean; 
    onClose: () => void; 
    value: Date; 
    onChange: (date: Date) => void;
  }) => {
    const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    const [selectedYear, setSelectedYear] = useState(value.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(value.getMonth() + 1);
    const [selectedDay, setSelectedDay] = useState(value.getDate());

    const handleConfirm = () => {
      const newDate = new Date(selectedYear, selectedMonth - 1, selectedDay);
      onChange(newDate);
      onClose();
    };

    return (
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
                  <Text style={[styles.modalTitle, { color: theme.text }]}>
                    {t('licenseInformation.selectDate')}
                  </Text>
                  <TouchableOpacity 
                    onPress={handleConfirm}
                    style={[styles.confirmButtonContainer, { backgroundColor: theme.success }]}
                  >
                    <Text style={styles.confirmButtonText}>
                      {t('common.confirm')}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.datePickerContainer}>
                  <View style={styles.datePickerColumn}>
                    <Text style={[styles.datePickerLabel, { color: theme.text }]}>
                      {t('licenseInformation.year')}
                    </Text>
                    <ScrollView 
                      style={styles.datePickerScroll}
                      showsVerticalScrollIndicator={false}
                    >
                      {years.map((year) => (
                        <TouchableOpacity
                          key={year}
                          style={[
                            styles.datePickerItem,
                            selectedYear === year && {
                              backgroundColor: colorScheme === 'dark' 
                                ? theme.primary + '30'  // 30% opacity for dark mode
                                : theme.primary + '15', // 15% opacity for light mode
                            }
                          ]}
                          onPress={() => setSelectedYear(year)}
                        >
                          <Text style={[
                            styles.datePickerItemText,
                            { color: theme.text },
                            selectedYear === year && {
                              fontWeight: 'bold',
                             color: colorScheme === 'dark' ? theme.text : theme.primary,
                              fontSize: 18, // Slightly larger text for selected item
                            }
                          ]}>
                            {year}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                  <View style={styles.datePickerColumn}>
                    <Text style={[styles.datePickerLabel, { color: theme.text }]}>
                      {t('licenseInformation.month')}
                    </Text>
                    <ScrollView 
                      style={styles.datePickerScroll}
                      showsVerticalScrollIndicator={false}
                    >
                      {months.map((month) => (
                        <TouchableOpacity
                          key={month}
                          style={[
                            styles.datePickerItem,
                            selectedMonth === month && {
                              backgroundColor: colorScheme === 'dark' 
                                ? theme.primary + '30'  // 30% opacity for dark mode
                                : theme.primary + '15', // 15% opacity for light mode
                            }
                          ]}
                          onPress={() => setSelectedMonth(month)}
                        >
                          <Text style={[
                            styles.datePickerItemText,
                            { color: theme.text },
                            selectedMonth === month && {
                              fontWeight: 'bold',
                              color: colorScheme === 'dark' ? theme.text : theme.primary,
                              fontSize: 18, // Slightly larger text for selected item
                            }
                          ]}>
                            {month}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                  <View style={styles.datePickerColumn}>
                    <Text style={[styles.datePickerLabel, { color: theme.text }]}>
                      {t('licenseInformation.day')}
                    </Text>
                    <ScrollView 
                      style={styles.datePickerScroll}
                      showsVerticalScrollIndicator={false}
                    >
                      {days.map((day) => (
                        <TouchableOpacity
                          key={day}
                          style={[
                            styles.datePickerItem,
                            selectedDay === day && {
                              backgroundColor: colorScheme === 'dark' 
                                ? theme.primary + '30'  // 30% opacity for dark mode
                                : theme.primary + '15', // 15% opacity for light mode
                            }
                          ]}
                          onPress={() => setSelectedDay(day)}
                        >
                          <Text style={[
                            styles.datePickerItemText,
                            { color: theme.text },
                            selectedDay === day && {
                              fontWeight: 'bold',
                              color: colorScheme === 'dark' ? theme.text : theme.primary,
                              fontSize: 18, // Slightly larger text for selected item
                            }
                          ]}>
                            {day}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  const isFormValid = () => {
    return (
      dpi.length >= 8 &&
      names.trim().length > 0 &&
      lastNames.trim().length > 0 &&
      licenseType &&
      renewalYears &&
      bornDate &&
      !errors.dpi &&
      !errors.names &&
      !errors.lastNames &&
      !errors.bornDate
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen
        options={{
          title: t('licenseInformation.title'),
          headerShadowVisible: false,
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
        }}
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <Text variant="title" style={[styles.title, { color: theme.primaryTitles }]}>
            {t('licenseInformation.title')}
          </Text>
          <Text style={[styles.subtitle, { color: theme.text }]}>
            {t('licenseInformation.subtitle')}
          </Text>
          
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.text }]}>
              {t('licenseInformation.dpi')}
            </Text>
            <FormInput
              value={dpi}
              onChangeText={setDpi}
              placeholder={t('licenseInformation.dpiOrPassportPlaceholder')}
              keyboardType="default"
              error={errors.dpi}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.text }]}>
              {t('licenseInformation.names')}
            </Text>
            <FormInput
              value={names}
              onChangeText={setNames}
              placeholder={t('licenseInformation.namesPlaceholder')}
              error={errors.names}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.text }]}>
              {t('licenseInformation.lastNames')}
            </Text>
            <FormInput
              value={lastNames}
              onChangeText={setLastNames}
              placeholder={t('licenseInformation.lastNamesPlaceholder')}
              error={errors.lastNames}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.text }]}>
              {t('licenseInformation.licenseType')}
            </Text>
            <Pressable
              style={[styles.pickerButton, { 
                backgroundColor: theme.formInputBackground,
                borderColor: theme.formInputBorder,
                borderWidth: 1,
                height: 60,
                marginBottom: 15,
                borderRadius: 10,
                paddingHorizontal: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }]}
              onPress={() => setShowLicenseTypePicker(true)}
            >
              <Text style={[styles.pickerButtonText, { color: theme.text }]}>
                {licenseType}
              </Text>
              <Ionicons name="chevron-down" size={20} color={theme.text} />
            </Pressable>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.text }]}>
              {t('licenseInformation.renewalYears')}
            </Text>
            <Pressable
              style={[styles.pickerButton, { 
                backgroundColor: theme.formInputBackground,
                borderColor: theme.formInputBorder,
                borderWidth: 1,
                height: 60,
                borderRadius: 10,
                marginBottom: 15,
                paddingHorizontal: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }]}
              onPress={() => setShowRenewalYearsPicker(true)}
            >
              <Text style={[styles.pickerButtonText, { color: theme.text }]}>
                {renewalYears} {t('licenseInformation.years')}
              </Text>
              <Ionicons name="chevron-down" size={20} color={theme.text} />
            </Pressable>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.text }]}>
              {t('licenseInformation.bornDate')}
            </Text>
            <Pressable
              style={[styles.pickerButton, { 
                backgroundColor: theme.formInputBackground,
                borderColor: theme.formInputBorder,
                borderWidth: 1,
                height: 60,
                borderRadius: 10,
                paddingHorizontal: 16,
                marginBottom: 15,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={[styles.pickerButtonText, { color: theme.text }]}>
                {bornDate.toLocaleDateString()}
              </Text>
              <Ionicons name="calendar" size={20} color={theme.text} />
            </Pressable>
            {errors.bornDate ? (
              <Text style={[styles.errorText, { color: theme.danger }]}>
                {errors.bornDate}
              </Text>
            ) : null}
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

      <CustomPicker
        visible={showLicenseTypePicker}
        onClose={() => setShowLicenseTypePicker(false)}
        items={LICENSE_TYPES}
        selectedValue={licenseType}
        onSelect={(value) => setLicenseType(value as LicenseType)}
      />

      <CustomPicker
        visible={showRenewalYearsPicker}
        onClose={() => setShowRenewalYearsPicker(false)}
        items={RENEWAL_YEARS}
        selectedValue={renewalYears}
        onSelect={setRenewalYears}
      />

      <CustomDatePicker
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        value={bornDate}
        onChange={handleDateChange}
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
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '600',
  },
  pickerButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  pickerButtonText: {
    fontSize: 16,
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
  },
  confirmButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  datePickerContainer: {
    flexDirection: 'row',
    height: 300,
    paddingHorizontal: 16,
  },
  datePickerColumn: {
    flex: 1,
    alignItems: 'center',
  },
  datePickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  datePickerScroll: {
    flex: 1,
    width: '100%',
  },
  datePickerItem: {
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 2,
    borderWidth: 1,
    borderColor: 'transparent', // Add transparent border to prevent layout shift
  },
  datePickerItemSelected: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  datePickerItemText: {
    fontSize: 16,
  },
  datePickerItemTextSelected: {
    fontWeight: 'bold',
  },
}); 