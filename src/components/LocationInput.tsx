import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Building, Landmark, Mic, MicOff } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { locationService, type LocationSuggestion } from '../services/locationService';

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  onLocationSelect?: (location: LocationSuggestion) => void;
  placeholder?: string;
}

const LocationInput: React.FC<LocationInputProps> = ({
  value,
  onChange,
  onLocationSelect,
  placeholder = "Where are you going?"
}) => {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const searchLocations = async () => {
      if (value.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoading(true);
      try {
        const results = await locationService.searchLocations(value);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (error) {
        console.error('Error searching locations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchLocations, 300);
    return () => clearTimeout(debounceTimer);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true; // Keep listening
      recognitionInstance.interimResults = true; // Show real-time results
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onstart = () => {
        setIsListening(true);
        console.log('🎤 Location voice search started');
      };
      
      recognitionInstance.onresult = (event: any) => {
        let transcript = '';
        
        // Get all recognized text (both interim and final)
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        
        // Type directly in input field as user speaks
        onChange(transcript);
      };
      
      recognitionInstance.onerror = (event: any) => {
        console.error('🚫 Location voice error:', event.error);
        if (event.error !== 'no-speech') {
          setIsListening(false);
        }
      };
      
      recognitionInstance.onend = () => {
        console.log('🛑 Location voice search ended');
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, [onChange]);

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    onChange(suggestion.name);
    setShowSuggestions(false);
    onLocationSelect?.(suggestion);
  };

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'business':
        return <Building size={16} className="text-blue-500" />;
      case 'landmark':
        return <Landmark size={16} className="text-purple-500" />;
      default:
        return <MapPin size={16} className="text-gray-500" />;
    }
  };

  const toggleVoiceRecognition = () => {
    if (!recognition) {
      alert('Voice recognition not supported in this browser');
      return;
    }
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={isListening ? "Listening..." : placeholder}
          className="flex-1 pr-10"
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          disabled={isListening}
        />
        <Button
          type="button"
          onClick={toggleVoiceRecognition}
          className={`${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-500 hover:bg-gray-600'} text-white px-3`}
          title={isListening ? "Stop listening" : "Voice search"}
        >
          {isListening ? <MicOff size={16} /> : <Mic size={16} />}
        </Button>
      </div>
      
      <div className="absolute right-16 top-1/2 transform -translate-y-1/2">
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        ) : (
          <MapPin size={16} className="text-muted-foreground" />
        )}
      </div>

      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto mt-1"
        >
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {getLocationIcon(suggestion.type)}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-gray-900 truncate">
                  {suggestion.name}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {suggestion.address}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationInput;