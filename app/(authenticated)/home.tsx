import { View, Text, StyleSheet, TouchableOpacity, Image, useColorScheme, FlatList, StatusBar, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Colors } from '@/constants/Colors';
import { t } from '@/constants/i18n';
import { FontAwesome5, MaterialCommunityIcons, Ionicons, AntDesign } from '@expo/vector-icons';
import { CompletedProcess } from '@/contexts/DataContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function Home() {
  const { signOut } = useAuth();
  const { hasActiveProcesses, completedProcesses, userProfile, updateProcessVerificationStep, logout } = useData();
  const colorScheme = useColorScheme() || 'light';
  const theme = Colors[colorScheme];

  const handleStartNewProcess = () => {
    router.push('/(authenticated)/user-information');
  };

  const handleLogout = async () => {
    // Erase all user data
    await logout();
    // Sign out from authentication
    await signOut();
    // The router navigation will be handled by AuthContext's state change
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  const getStatusColor = (status: 'pending' | 'processing' | 'completed') => {
    switch (status) {
      case 'pending':
        return '#FF9500'; // Orange for pending
      case 'processing':
        return '#007AFF'; // Blue for processing
      case 'completed':
        return '#34C759'; // Green for completed
      default:
        return theme.text;
    }
  };

  const getStatusText = (status: 'pending' | 'processing' | 'completed') => {
    switch (status) {
      case 'pending':
        return t('process.statusPending');
      case 'processing':
        return t('process.statusProcessing');
      case 'completed':
        return t('process.statusCompleted');
      default:
        return '';
    }
  };

  const getStatusIcon = (status: 'pending' | 'processing' | 'completed') => {
    switch (status) {
      case 'pending':
        return <AntDesign name="clockcircleo" size={16} color="#FFFFFF" />;
      case 'processing':
        return <AntDesign name="sync" size={16} color="#FFFFFF" />;
      case 'completed':
        return <AntDesign name="checkcircleo" size={16} color="#FFFFFF" />;
      default:
        return null;
    }
  };

  // Get user's full name or email username
  const getUserName = () => {
    if (completedProcesses && completedProcesses.length > 0) {
      const process = completedProcesses[0];
      if (process.licenseInformation && process.licenseInformation.names) {
        return `${process.licenseInformation.names}`;
      }
    }
    
    if (userProfile && userProfile.email) {
      return userProfile.email.split('@')[0];
    }
    
    return t('home.welcome');
  };

  const handleToggleStep = async (processId: string, step: 'visualTest' | 'transitVerification', currentStatus: boolean) => {
    await updateProcessVerificationStep(processId, step, !currentStatus);
  };

  const handleNavigateToStep = (processId: string, step: 'visualTest' | 'transitVerification') => {
    if (step === 'visualTest') {
      router.push({
        pathname: '/process-steps/visual-test',
        params: { id: processId }
      });
    } else {
      router.push({
        pathname: '/process-steps/transit-verification',
        params: { id: processId }
      });
    }
  };

  const WelcomeHeader = () => (
    <View style={styles.welcomeHeaderContainer}>
      {hasActiveProcesses() ? (
        <View style={styles.welcomeTextContainer}>
          <Text style={[styles.welcomeBackText, { color: theme.text, fontWeight: 'bold' }]}>
            {t('home.welcomeBack')}
          </Text>
          <Text style={[styles.userName, { color: theme.text }]}>
            {getUserName()}
          </Text>
        </View>
      ) : (
        <View style={styles.welcomeTextContainer} />
      )}
      
      <TouchableOpacity 
        style={[styles.logoutButton, { backgroundColor: theme.formInputBackground }]} 
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={24} color={theme.text} />
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      <WelcomeHeader />
      
      <View style={styles.content}>
        <Image 
          source={require('@/assets/images/image_licence_blank.png')}
          style={styles.emptyImage}
          resizeMode="contain"
        />
        <Text style={[styles.title, { color: theme.text }]}>
          {t('home.emptyState.title')}
        </Text>
        <Text style={[styles.description, { color: theme.text }]}>
          {t('home.emptyState.description')}
        </Text>
        <TouchableOpacity 
          style={[styles.exploreButton, { backgroundColor: theme.primary }]}
          onPress={handleStartNewProcess}
        >
          <Text style={styles.buttonText}>{t('home.emptyState.startButton')}</Text>
        </TouchableOpacity>
      </View>
      
      { process.visualTestCompleted && <View style={styles.logoContainer}>
        <Image 
          source={require('@/assets/images/LogoMaycom.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
        </View>
      }
    </SafeAreaView>
  );

  const renderProcessItem = ({ item: process }: { item: CompletedProcess }) => {
    // Determine primary color for card based on process type
    const primaryColor = process.processTypes.includes('renewal') 
      ? theme.primary 
      : process.processTypes.includes('replacement') 
        ? theme.secondary 
        : theme.primary;
    
    // Create gradient colors
    const gradientStart = `${primaryColor}CC`; // 80% opacity
    const gradientEnd = `${primaryColor}`;
    
    // Get status color
    const statusColor = getStatusColor(process.status);
    
    // Determine process type text
    const getProcessTypeDisplay = () => {
      const hasRenewal = process.processTypes.includes('renewal');
      const hasReplacement = process.processTypes.includes('replacement');
      
      if (hasRenewal && hasReplacement) {
        return (
          <View style={styles.typeChip}>
            <AntDesign name="swap" size={14} color="#FFFFFF" style={styles.typeIcon} />
            <Text style={styles.typeChipText}>
              {t('processResume.renewalAndReplacement')}
            </Text>
          </View>
        );
      } else if (hasRenewal) {
        return (
          <View style={styles.typeChip}>
            <FontAwesome5 name="sync" size={14} color="#FFFFFF" style={styles.typeIcon} />
            <Text style={styles.typeChipText}>
              {t('processType.renewal')}
            </Text>
          </View>
        );
      } else if (hasReplacement) {
        return (
          <View style={styles.typeChip}>
            <MaterialCommunityIcons name="folder-cog" size={14} color="#FFFFFF" style={styles.typeIcon} />
            <Text style={styles.typeChipText}>
              {t('processType.replacement')}
            </Text>
          </View>
        );
      }
      return null;
    };
    
    return (
      <View style={[styles.processCardContainer, { shadowColor: theme.text }]}>
        <LinearGradient
          colors={[gradientStart, gradientEnd]}
          style={styles.processCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Status Header */}
          <View style={styles.statusHeader}>
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
              {getStatusIcon(process.status)}
              <Text style={styles.statusText}>
                {getStatusText(process.status)}
              </Text>
            </View>
          </View>
          
          {/* License Info */}
          <View style={styles.licenseInfoContainer}>
            <View style={styles.licenseInfoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>{t('licenseInformation.dpi')}</Text>
                <Text style={styles.infoValue}>{process.licenseInformation.dpi}</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>{t('process.licenseType')}</Text>
                <Text style={styles.infoValue}>{process.licenseInformation.licenseType}</Text>
              </View>
            </View>
            
            <View style={styles.licenseInfoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>{t('process.paymentDate')}</Text>
                <Text style={styles.infoValue}>{formatDate(process.paymentDate)}</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>{t('licenseInformation.renewalYears')}</Text>
                <Text style={styles.infoValue}>
                  {process.licenseInformation.renewalYears !== 'unselected' 
                    ? `${process.licenseInformation.renewalYears} ${t('licenseInformation.years')}` 
                    : '-'}
                </Text>
              </View>
            </View>
          </View>
          
          {/* Card Footer */}
          <View style={styles.cardFooter}>
            {getProcessTypeDisplay()}
          </View>
        </LinearGradient>
      </View>
    );
  };

  const renderProcessSteps = () => {
    // Only render steps if there's at least one process
    if (!completedProcesses || completedProcesses.length === 0) {
      return null;
    }
    
    // Use the first process for demonstration
    const process = completedProcesses[0];
    
    return (
      <View style={[styles.processStepsSection, { backgroundColor: theme.background }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {t('process.steps.title')}
        </Text>
        
        <View style={[styles.stepsCard, { backgroundColor: theme.formInputBackground }]}>
          {/* Visual Test Step */}
          <TouchableOpacity 
            style={styles.stepButton}
            onPress={() => handleNavigateToStep(process.id, 'visualTest')}
          >
            <View style={styles.stepRow}>
              <View style={[styles.stepIndicator, process.visualTestCompleted ? styles.stepCompleted : styles.stepPending]}>
                {process.visualTestCompleted ? 
                  <AntDesign name="check" size={14} color="#FFFFFF" /> : 
                  <View style={styles.stepDot} />
                }
              </View>
              <View style={styles.stepTextContainer}>
                <Text style={[styles.stepText, { color: theme.text }]}>{t('process.steps.visualTest')}</Text>
                <Text style={[styles.stepDescription, { color: theme.text + '99' }]}>{t('process.steps.visualTestDescription')}</Text>
              </View>
            </View>
            <AntDesign name="right" size={16} color={theme.text + '80'} />
          </TouchableOpacity>
          
          <View style={styles.stepDivider} />
          
          {/* Transit Department Verification */}
          <TouchableOpacity 
            style={styles.stepButton}
            onPress={() => handleNavigateToStep(process.id, 'transitVerification')}
          >
            <View style={styles.stepRow}>
              <View style={[styles.stepIndicator, process.transitVerificationCompleted ? styles.stepCompleted : styles.stepPending]}>
                {process.transitVerificationCompleted ? 
                  <AntDesign name="check" size={14} color="#FFFFFF" /> : 
                  <View style={styles.stepDot} />
                }
              </View>
              <View style={styles.stepTextContainer}>
                <Text style={[styles.stepText, { color: theme.text }]}>{t('process.steps.transitVerification')}</Text>
                <Text style={[styles.stepDescription, { color: theme.text + '99' }]}>{t('process.steps.transitVerificationDescription')}</Text>
              </View>
            </View>
            <AntDesign name="right" size={16} color={theme.text + '80'} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderProcessList = () => (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      <WelcomeHeader />
      
      <FlatList
        data={completedProcesses}
        renderItem={renderProcessItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={() => (
          <>
            {renderProcessSteps()}
            <View style={styles.logoContainer}>
              <Image 
                source={require('@/assets/images/LogoMaycom.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </>
        )}
      />
    </SafeAreaView>
  );

  return hasActiveProcesses() ? renderProcessList() : renderEmptyState();
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  welcomeHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  welcomeTextContainer: {
    flexDirection: 'column',
  },
  welcomeBackText: {
    fontSize: 16,
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  logoutButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  exploreButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    maxWidth: 300,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  processCardContainer: {
    marginBottom: 20,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  processCard: {
    borderRadius: 16,
    padding: 20,
    overflow: 'hidden',
  },
  statusHeader: {
    flexDirection: 'row',
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    paddingBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  typeIcon: {
    marginRight: 6,
  },
  typeChipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  licenseInfoContainer: {
    gap: 16,
    marginBottom: 20,
  },
  licenseInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  infoItem: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-start',
  },
  infoLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  processStepsSection: {
    padding: 20,
    marginTop: 10,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  stepsCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  stepsList: {
    gap: 12,
  },
  stepButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  stepDivider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    marginHorizontal: 16,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stepIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepTextContainer: {
    flex: 1,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  stepCompleted: {
    backgroundColor: '#34C759',
  },
  stepPending: {
    backgroundColor: 'rgba(100, 100, 100, 0.5)',
  },
  stepText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
  },
  stepsHelp: {
    textAlign: 'center',
    fontSize: 14,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    marginTop: 'auto',
  },
  logoImage: {
    width: 120,
    height: 60,
  },
}); 