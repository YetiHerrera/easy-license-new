import { View, StyleSheet, useColorScheme, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, router } from 'expo-router';
import { Text } from '@/components/Text';
import { Colors } from '@/constants/Colors';
import { t } from '@/constants/i18n';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useData } from '@/contexts/DataContext';

// Fixed charges in Quetzales
const CHARGES = {
  renewal: 100,
  replacement: 100,
  visualTest: 50,
  expiredLicense: 50,
  delivery: 120,
};

// Exchange rate
const EXCHANGE_RATE = 7.85; // 7.85 Quetzales per dollar

export default function ProcessResume() {
  const colorScheme = useColorScheme() || 'light';
  const theme = Colors[colorScheme];
  const { userProfile, processData } = useData();
  
  // Calculate total charges
  const calculateTotal = () => {
    let total = 0;
    
    // Add process type charges
    if (processData.processTypes.includes('renewal')) {
      total += CHARGES.renewal;
    }
    if (processData.processTypes.includes('replacement')) {
      total += CHARGES.replacement;
    }
    
    // Add other charges
    total += CHARGES.visualTest;
    total += CHARGES.expiredLicense;
    total += CHARGES.delivery;
    
    return total;
  };
  
  const totalAmount = calculateTotal();
  const totalUSD = (totalAmount / EXCHANGE_RATE).toFixed(2);

  const handleConfirm = () => {
    // Navigate to payment screen
    router.push('/(authenticated)/process-review/payment' as any);
  };

  const getProcessTypeText = () => {
    if (processData.processTypes.includes('renewal') && processData.processTypes.includes('replacement')) {
      return t('processResume.renewalAndReplacement');
    } else if (processData.processTypes.includes('renewal')) {
      return t('processType.renewal');
    } else if (processData.processTypes.includes('replacement')) {
      return t('processType.replacement');
    }
    return '';
  };

  // Format the address for display
  const getFormattedAddress = () => {
    const { streetAddress, apartment, city, state, zipCode } = processData.deliveryAddress;
    let address = streetAddress;
    if (apartment) {
      address += `, ${apartment}`;
    }
    return address;
  };

  // Get the user's full name
  const getFullName = () => {
    const { names, lastNames } = processData.licenseInformation;
    return `${names} ${lastNames}`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen
        options={{
          title: t('processResume.title'),
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
              {t('processResume.title')}
            </Text>
            <Text style={[styles.subtitle, { color: theme.text }]}>
              {t('processResume.subtitle')}
            </Text>
            
            {/* Process Summary Card */}
            <View style={[styles.card, { backgroundColor: theme.formInputBackground, borderColor: theme.formInputBorder }]}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                {t('processResume.processSummaryTitle')}
              </Text>
              <Text style={[styles.processTypeText, { color: theme.text }]}>
                {getProcessTypeText()}
              </Text>
              
              {/* Process Details Grid */}
              <View style={styles.detailsGrid}>
                {/* Row 1 */}
                <View style={styles.detailColumn}>
                  <Text style={[styles.detailLabel, { color: theme.text }]}>
                    {t('processResume.address')}
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.text }]}>
                    {getFormattedAddress()}
                  </Text>
                </View>
                
                <View style={styles.detailColumn}>
                  <Text style={[styles.detailLabel, { color: theme.text }]}>
                    {t('processResume.postalCode')}
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.text }]}>
                    {processData.deliveryAddress.zipCode}
                  </Text>
                </View>
                
                {/* Row 2 */}
                <View style={styles.detailColumn}>
                  <Text style={[styles.detailLabel, { color: theme.text }]}>
                    {t('processResume.phoneNumber')}
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.text }]}>
                    {userProfile.countryCode}{userProfile.phoneNumber}
                  </Text>
                </View>
                
                <View style={styles.detailColumn}>
                  <Text style={[styles.detailLabel, { color: theme.text }]}>
                    {t('processResume.name')}
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.text }]}>
                    {getFullName()}
                  </Text>
                </View>
                
                {/* Row 3 */}
                <View style={styles.detailColumn}>
                  <Text style={[styles.detailLabel, { color: theme.text }]}>
                    {t('processResume.licenseType')}
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.text }]}>
                    {processData.licenseInformation.licenseType !== 'unselected' 
                      ? processData.licenseInformation.licenseType 
                      : '-'}
                  </Text>
                </View>
              </View>
            </View>
            
            {/* Payment Summary Card */}
            <View style={[styles.card, { backgroundColor: theme.formInputBackground, borderColor: theme.formInputBorder }]}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                {t('processResume.paymentSummaryTitle')}
              </Text>
              <Text style={[styles.paymentDescription, { color: theme.text }]}>
                {t('processResume.paymentDescription')}
              </Text>
              
              {/* Process Type Charges */}
              {processData.processTypes.includes('renewal') && (
                <View style={styles.paymentRow}>
                  <Text style={[styles.paymentItem, { color: theme.text }]}>
                    {t('processType.renewal')}
                  </Text>
                  <Text style={[styles.paymentAmount, { color: theme.text }]}>
                    Q{CHARGES.renewal.toFixed(2)}
                  </Text>
                </View>
              )}
              
              {processData.processTypes.includes('replacement') && (
                <View style={styles.paymentRow}>
                  <Text style={[styles.paymentItem, { color: theme.text }]}>
                    {t('processType.replacement')}
                  </Text>
                  <Text style={[styles.paymentAmount, { color: theme.text }]}>
                    Q{CHARGES.replacement.toFixed(2)}
                  </Text>
                </View>
              )}
              
              {/* Other Charges */}
              <View style={styles.paymentRow}>
                <Text style={[styles.paymentItem, { color: theme.text }]}>
                  {t('processResume.visualTest')}
                </Text>
                <Text style={[styles.paymentAmount, { color: theme.text }]}>
                  Q{CHARGES.visualTest.toFixed(2)}
                </Text>
              </View>
              
              <View style={styles.paymentRow}>
                <Text style={[styles.paymentItem, { color: theme.text }]}>
                  {t('processResume.expiredLicense')}
                </Text>
                <Text style={[styles.paymentAmount, { color: theme.text }]}>
                  Q{CHARGES.expiredLicense.toFixed(2)}
                </Text>
              </View>
              
              <View style={styles.paymentRow}>
                <Text style={[styles.paymentItem, { color: theme.text }]}>
                  {t('processResume.delivery')}
                </Text>
                <Text style={[styles.paymentAmount, { color: theme.text }]}>
                  Q{CHARGES.delivery.toFixed(2)}
                </Text>
              </View>
              
              {/* Total */}
              <View style={[styles.totalRow, { borderTopColor: theme.formInputBorder }]}>
                <Text style={[styles.totalLabel, { color: theme.text }]}>
                  {t('processResume.total')}
                </Text>
                <View style={styles.totalAmountContainer}>
                  <Text style={[styles.usdAmount, { color: theme.secondary }]}>
                    (USD${totalUSD})
                  </Text>
                  <Text style={[styles.totalAmount, { color: theme.text }]}>
                    Q{totalAmount.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.confirmButton, { backgroundColor: theme.primary }]}
            onPress={handleConfirm}
          >
            <Text style={styles.confirmButtonText}>
              {t('processResume.confirmAndPay')}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
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
    paddingBottom: 40,
  },
  formContainer: {
    flex: 1,
    gap: 16,
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
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  processTypeText: {
    fontSize: 16,
    marginBottom: 16,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  detailColumn: {
    width: '45%', // Almost half the width to create 2 columns with gap
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
  },
  paymentDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  paymentItem: {
    fontSize: 16,
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmountContainer: {
    alignItems: 'flex-end',
  },
  usdAmount: {
    fontSize: 14,
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  confirmButton: {
    height: 56,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 