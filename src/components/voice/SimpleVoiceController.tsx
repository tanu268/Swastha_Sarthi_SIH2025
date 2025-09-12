import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Volume2, VolumeX, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { StateData } from '@/data/northeastStates';

interface SimpleVoiceControllerProps {
  onStateSelect?: (state: StateData) => void;
  onQuickAction?: (action: string) => void;
  onRiskQuery?: (query: string) => void;
}

export function SimpleVoiceController({ 
  onStateSelect, 
  onQuickAction,
  onRiskQuery 
}: SimpleVoiceControllerProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  // Initialize speech recognition
  React.useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = i18n.language === 'hi' ? 'hi-IN' : 'en-US';
      
      recognitionInstance.onstart = () => {
        setIsListening(true);
        toast.success(t('voice.connected'));
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      recognitionInstance.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase();
        handleVoiceCommand(command);
      };
      
      recognitionInstance.onerror = (error) => {
        setIsListening(false);
        toast.error(t('voice.error') + ': ' + error.error);
      };
      
      setRecognition(recognitionInstance);
    }
  }, [i18n.language, t]);

  const handleVoiceCommand = useCallback((command: string) => {
    console.log('Voice command:', command);
    
    // Navigation commands
    if (command.includes('dashboard') || command.includes('डैशबोर्ड')) {
      navigate('/dashboard');
      speak(t('Navigating to dashboard'));
    } else if (command.includes('alerts') || command.includes('अलर्ट')) {
      navigate('/alerts');
      speak(t('Navigating to alerts'));
    } else if (command.includes('reports') || command.includes('रिपोर्ट')) {
      navigate('/reports');
      speak(t('Navigating to reports'));
    }
    
    // State selection commands
    const states = ['assam', 'manipur', 'meghalaya', 'mizoram', 'nagaland', 'sikkim', 'tripura', 'arunachal'];
    const foundState = states.find(state => command.includes(state));
    if (foundState && onStateSelect) {
      const mockState: StateData = {
        id: foundState,
        name: foundState.charAt(0).toUpperCase() + foundState.slice(1),
        capital: '',
        coordinates: { lat: 26.2006, lng: 92.9376 },
        population: 1000000,
        healthStatus: 'moderate',
        waterQuality: 80,
        healthFacilities: 10,
        activeAlerts: 2,
        districts: []
      };
      onStateSelect(mockState);
      speak(`Selected ${foundState}`);
    }
    
    // Risk analysis commands
    if (command.includes('risk') || command.includes('जोखिम') || command.includes('analyze')) {
      onRiskQuery?.(`Risk analysis for ${command}`);
      speak('Analyzing outbreak risk data');
    }
    
    // Quick actions
    if (command.includes('refresh') || command.includes('update')) {
      onQuickAction?.('refresh');
      speak('Refreshing data');
    } else if (command.includes('alert') || command.includes('send')) {
      onQuickAction?.('send_alert');
      speak('Sending alert');
    }
    
    // Language switching
    if (command.includes('hindi') || command.includes('हिंदी')) {
      i18n.changeLanguage('hi');
      speak('भाषा हिंदी में बदल दी गई');
    } else if (command.includes('english') || command.includes('अंग्रेजी')) {
      i18n.changeLanguage('en');
      speak('Language changed to English');
    }
  }, [navigate, onStateSelect, onQuickAction, onRiskQuery, i18n, t]);

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = i18n.language === 'hi' ? 'hi-IN' : 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    }
  }, [i18n.language]);

  const toggleListening = useCallback(() => {
    if (!recognition) {
      toast.error('Speech recognition not supported');
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  }, [recognition, isListening]);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return (
    <div className="flex items-center space-x-2">
      <Button
        onClick={toggleListening}
        variant={isListening ? "destructive" : "default"}
        size="sm"
        className="relative"
      >
        {isListening ? (
          <MicOff className="w-4 h-4" />
        ) : (
          <Mic className="w-4 h-4" />
        )}
      </Button>

      <Button
        onClick={stopSpeaking}
        variant="outline"
        size="sm"
        disabled={!isSpeaking}
      >
        {isSpeaking ? (
          <VolumeX className="w-4 h-4" />
        ) : (
          <Volume2 className="w-4 h-4" />
        )}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="text-xs"
      >
        <Bot className="w-4 h-4 mr-1" />
        <Badge variant="outline" className="text-xs">
          {isListening ? t('voice.listening') : t('voice.inactive')}
        </Badge>
      </Button>
    </div>
  );
}