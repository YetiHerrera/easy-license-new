import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types for user profile information
interface UserProfile {
  email: string;
  phoneNumber: string;
  countryCode: string;
}

// Types for process data
type ProcessType = 'renewal' | 'replacement';
type LicenseType = 'A' | 'B' | 'C' | 'M' | 'E' | 'unselected';

// License information
interface LicenseInformation {
  dpi: string;
  names: string;
  lastNames: string;
  licenseType: LicenseType;
  renewalYears: string;
  bornDate: Date;
}

// Delivery address information
interface DeliveryAddress {
  streetAddress: string;
  apartment: string;
  city: string;
  state: string;
  zipCode: string;
}

// Test results
interface TestResult {
  score: number;
  totalQuestions: number;
  passed: boolean;
}

// All process data combined
interface ProcessData {
  licenseInformation: LicenseInformation;
  deliveryAddress: DeliveryAddress;
  processTypes: ProcessType[];
}

// Completed process with additional metadata
export interface CompletedProcess extends ProcessData {
  id: string;
  status: 'pending' | 'processing' | 'completed';
  paymentDate: Date;
  amount: number;
  estimatedDeliveryDate: Date;
  visualTestCompleted?: boolean;
  documentVerificationCompleted?: boolean;
  transitVerificationCompleted?: boolean;
  testResults?: {
    colorblind?: TestResult;
    depthPerception?: TestResult;
    myopia?: TestResult;
  };
}

// Combined data context type
interface DataContextType {
  userProfile: UserProfile;
  processData: ProcessData;
  completedProcesses: CompletedProcess[];
  // User profile methods
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  // Process data methods
  updateLicenseInformation: (data: Partial<LicenseInformation>) => Promise<void>;
  updateDeliveryAddress: (data: Partial<DeliveryAddress>) => Promise<void>;
  updateProcessTypes: (types: ProcessType[]) => Promise<void>;
  // Completed processes methods
  addCompletedProcess: (amount: number) => Promise<string>;
  updateCompletedProcessStatus: (id: string, status: 'pending' | 'processing' | 'completed') => Promise<void>;
  updateProcessVerificationStep: (id: string, step: 'visualTest' | 'documentVerification' | 'transitVerification', completed: boolean) => Promise<CompletedProcess | undefined>;
  saveTestResults: (id: string, testType: 'colorblind' | 'depthPerception' | 'myopia', results: TestResult) => Promise<void>;
  // Helper methods
  resetProcessData: () => Promise<void>;
  hasActiveProcesses: () => boolean;
  // Logout
  logout: () => Promise<void>;
}

// Initial values
const initialUserProfile: UserProfile = {
  email: '',
  phoneNumber: '',
  countryCode: '+502', // Default to Guatemala
};

const initialLicenseInformation: LicenseInformation = {
  dpi: '',
  names: '',
  lastNames: '',
  licenseType: 'unselected',
  renewalYears: 'unselected',
  bornDate: new Date(),
};

const initialDeliveryAddress: DeliveryAddress = {
  streetAddress: '',
  apartment: '',
  city: '',
  state: '',
  zipCode: '',
};

const initialProcessData: ProcessData = {
  licenseInformation: initialLicenseInformation,
  deliveryAddress: initialDeliveryAddress,
  processTypes: [],
};

// Create context
const DataContext = createContext<DataContextType | undefined>(undefined);

// Storage keys
const USER_PROFILE_KEY = 'user_profile';
const PROCESS_DATA_KEY = 'process_data';
const COMPLETED_PROCESSES_KEY = 'completed_processes';

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);
  const [processData, setProcessData] = useState<ProcessData>(initialProcessData);
  const [completedProcesses, setCompletedProcesses] = useState<CompletedProcess[]>([]);

  // Load saved data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load user profile
        const savedUserProfile = await AsyncStorage.getItem(USER_PROFILE_KEY);
        if (savedUserProfile) {
          setUserProfile(JSON.parse(savedUserProfile));
        }

        // Load process data
        const savedProcessData = await AsyncStorage.getItem(PROCESS_DATA_KEY);
        if (savedProcessData) {
          const parsedData = JSON.parse(savedProcessData);

          // Convert string date back to Date object
          if (parsedData.licenseInformation?.bornDate) {
            parsedData.licenseInformation.bornDate = new Date(parsedData.licenseInformation.bornDate);
          }

          setProcessData(parsedData);
        }

        // Load completed processes
        const savedCompletedProcesses = await AsyncStorage.getItem(COMPLETED_PROCESSES_KEY);
        if (savedCompletedProcesses) {
          const parsedProcesses = JSON.parse(savedCompletedProcesses);

          // Convert string dates back to Date objects
          parsedProcesses.forEach((process: CompletedProcess) => {
            process.licenseInformation.bornDate = new Date(process.licenseInformation.bornDate);
            process.paymentDate = new Date(process.paymentDate);
            process.estimatedDeliveryDate = new Date(process.estimatedDeliveryDate);
          });

          setCompletedProcesses(parsedProcesses);
        }
      } catch (error) {
        console.error('Error loading data from storage:', error);
      }
    };

    loadData();
  }, []);

  // Update user profile
  const updateUserProfile = async (data: Partial<UserProfile>) => {
    try {
      const updatedProfile = { ...userProfile, ...data };
      setUserProfile(updatedProfile);
      await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updatedProfile));
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  // Update license information
  const updateLicenseInformation = async (data: Partial<LicenseInformation>) => {
    try {
      const updatedProcessData = {
        ...processData,
        licenseInformation: { ...processData.licenseInformation, ...data },
      };
      setProcessData(updatedProcessData);
      await AsyncStorage.setItem(PROCESS_DATA_KEY, JSON.stringify(updatedProcessData));
    } catch (error) {
      console.error('Error updating license information:', error);
    }
  };

  // Update delivery address
  const updateDeliveryAddress = async (data: Partial<DeliveryAddress>) => {
    try {
      const updatedProcessData = {
        ...processData,
        deliveryAddress: { ...processData.deliveryAddress, ...data },
      };
      setProcessData(updatedProcessData);
      await AsyncStorage.setItem(PROCESS_DATA_KEY, JSON.stringify(updatedProcessData));
    } catch (error) {
      console.error('Error updating delivery address:', error);
    }
  };

  // Update process types
  const updateProcessTypes = async (types: ProcessType[]) => {
    try {
      const updatedProcessData = {
        ...processData,
        processTypes: types,
      };
      setProcessData(updatedProcessData);
      await AsyncStorage.setItem(PROCESS_DATA_KEY, JSON.stringify(updatedProcessData));
    } catch (error) {
      console.error('Error updating process types:', error);
    }
  };

  // Add a completed process
  const addCompletedProcess = async (amount: number): Promise<string> => {
    try {
      // Generate a unique ID
      const id = Date.now().toString();

      // Set payment date to now
      const paymentDate = new Date();

      // Set estimated delivery date to 14 days from now
      const estimatedDeliveryDate = new Date();
      estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 14);

      // Create the completed process
      const completedProcess: CompletedProcess = {
        ...processData,
        id,
        status: 'pending',
        paymentDate,
        amount,
        estimatedDeliveryDate,
        visualTestCompleted: false,
        documentVerificationCompleted: false,
        transitVerificationCompleted: false,
      };

      // Add to the list
      const updatedProcesses = [...completedProcesses, completedProcess];
      setCompletedProcesses(updatedProcesses);

      // Save to storage
      await AsyncStorage.setItem(COMPLETED_PROCESSES_KEY, JSON.stringify(updatedProcesses));

      // Reset current process data
      await resetProcessData();

      return id;
    } catch (error) {
      console.error('Error adding completed process:', error);
      throw error;
    }
  };

  // Update a completed process status
  const updateCompletedProcessStatus = async (id: string, status: 'pending' | 'processing' | 'completed') => {
    try {
      const updatedProcesses = completedProcesses.map(process => {
        if (process.id === id) {
          return { ...process, status };
        }
        return process;
      });

      setCompletedProcesses(updatedProcesses);
      await AsyncStorage.setItem(COMPLETED_PROCESSES_KEY, JSON.stringify(updatedProcesses));
    } catch (error) {
      console.error('Error updating process status:', error);
    }
  };

  // Update a verification step of a process
  const updateProcessVerificationStep = async (id: string, step: 'visualTest' | 'documentVerification' | 'transitVerification', completed: boolean) => {
    try {
      console.log(`Updating ${step} to ${completed} for process ${id}`);
      console.log('Current processes:', completedProcesses);

      const updatedProcesses = completedProcesses.map(process => {
        if (process.id === id) {
          console.log(`Found process to update:`, process);

          let updatedProcess;
          if (step === 'visualTest') {
            // For visual test, we need to check if all tests are completed
            const hasAllTestResults = process.testResults?.colorblind &&
                                    process.testResults?.depthPerception &&
                                    process.testResults?.myopia;

            // If we're marking as completed, check if all tests are done
            // If we're marking as not completed, allow it regardless
            updatedProcess = { 
              ...process, 
              visualTestCompleted: completed ? hasAllTestResults : false 
            };
          } else if (step === 'documentVerification') {
            updatedProcess = { ...process, documentVerificationCompleted: completed };
          } else {
            updatedProcess = { ...process, transitVerificationCompleted: completed };
          }

          console.log(`Updated process:`, updatedProcess);
          return updatedProcess;
        }
        return process;
      });

      console.log('Setting updated processes');
      setCompletedProcesses(updatedProcesses);

      console.log('Saving to AsyncStorage');
      await AsyncStorage.setItem(COMPLETED_PROCESSES_KEY, JSON.stringify(updatedProcesses));

      console.log('Update complete');
      return updatedProcesses.find(p => p.id === id);
    } catch (error) {
      console.error('Error updating verification step:', error);
      throw error;
    }
  };

  // Save test results
  const saveTestResults = async (id: string, testType: 'colorblind' | 'depthPerception' | 'myopia', results: TestResult) => {
    try {
      const updatedProcesses = completedProcesses.map(process => {
        if (process.id === id) {
          const updatedTestResults = {
            ...(process.testResults || {}),
            [testType]: results
          };

          // Check if all tests are completed after this update
          const hasAllTests = updatedTestResults.colorblind &&
                            updatedTestResults.depthPerception &&
                            updatedTestResults.myopia;

          return { 
            ...process, 
            testResults: updatedTestResults,
            // Automatically mark visual test as completed if all tests are done
            // This allows the visual test to be marked as completed automatically when all tests are done
            visualTestCompleted: hasAllTests
          };
        }
        return process;
      });

      setCompletedProcesses(updatedProcesses);
      await AsyncStorage.setItem(COMPLETED_PROCESSES_KEY, JSON.stringify(updatedProcesses));
    } catch (error) {
      console.error('Error saving test results:', error);
    }
  };

  // Reset process data
  const resetProcessData = async () => {
    try {
      setProcessData(initialProcessData);
      await AsyncStorage.removeItem(PROCESS_DATA_KEY);
    } catch (error) {
      console.error('Error resetting process data:', error);
    }
  };

  // Logout and erase all data
  const logout = async () => {
    try {
      // Reset all state
      setUserProfile(initialUserProfile);
      setProcessData(initialProcessData);
      setCompletedProcesses([]);

      // Clear AsyncStorage
      await AsyncStorage.removeItem(USER_PROFILE_KEY);
      await AsyncStorage.removeItem(PROCESS_DATA_KEY);
      await AsyncStorage.removeItem(COMPLETED_PROCESSES_KEY);

      console.log('All user data has been erased on logout');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Check if there are any active processes
  const hasActiveProcesses = () => {
    return completedProcesses.length > 0;
  };

  return (
    <DataContext.Provider
      value={{
        userProfile,
        processData,
        completedProcesses,
        updateUserProfile,
        updateLicenseInformation,
        updateDeliveryAddress,
        updateProcessTypes,
        addCompletedProcess,
        updateCompletedProcessStatus,
        updateProcessVerificationStep,
        saveTestResults,
        resetProcessData,
        hasActiveProcesses,
        logout,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

// Custom hook to use the data context
export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
} 
