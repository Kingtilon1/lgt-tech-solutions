import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import Layout from '@/components/Layout';
import PageBanner from '@/components/PageBanner';
import emailjs from '@emailjs/browser';

// Extract Vite env vars (must start with VITE_)
const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID!;
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID!;
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY!;

const QuotePage: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    projectType: '',
    budget: '',
    timeline: '',
    details: '',
    servicesNeeded: {
      lowVoltage: false,
      security: false,
      accessControl: false,
      cabling: false,
      smartBuilding: false,
      handyman: false,
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize EmailJS with publicKey once
  useEffect(() => {
    emailjs.init(publicKey);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (
    service: keyof typeof formData.servicesNeeded,
    checked: boolean
  ) => {
    setFormData(prev => ({
      ...prev,
      servicesNeeded: {
        ...prev.servicesNeeded,
        [service]: checked,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Prepare services list
    const selectedServices = Object.entries(formData.servicesNeeded)
      .filter(([_, selected]) => selected)
      .map(([key]) => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()));

    // Map to EmailJS template variable names
    const templateParams = {
      to_name: 'LGT',      // matches {{to_name}}
      name: formData.name,           // matches {{from_name}}
      email: formData.email,         // matches {{email}}           // matches {{reply_to}}
      phone: formData.phone,
      city: formData.city,
      project_type: formData.projectType,
      services: selectedServices.join(', '),
      budget: formData.budget,
      timeline: formData.timeline,
      message: formData.details,          // matches {{message}}
    };

    try {
      await emailjs.send(serviceId, templateId, templateParams);
      toast({
        title: 'Quote Request Sent!',
        description:
          "We'll review your request and get back to you soon. Check your email for confirmation.",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        city: '',
        projectType: '',
        budget: '',
        timeline: '',
        details: '',
        servicesNeeded: {
          lowVoltage: false,
          security: false,
          accessControl: false,
          cabling: false,
          smartBuilding: false,
          handyman: false,
        },
      });
    } catch (error) {
      console.error('Error sending quote request:', error);
      toast({
        title: 'Error',
        description:
          'There was an issue sending your quote request. Please try again or contact us directly.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <PageBanner
        title="Request a Quote"
        subtitle="Fill out the form below to get a free, no-obligation quote for your project."
      />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-lgt-dark mb-1">
                      Full Name*
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-lgt-dark mb-1">
                      Email Address*
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-lgt-dark mb-1">
                      Phone Number*
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <h2 className="text-xl font-semibold mb-4">Project Location</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-lgt-dark mb-1">
                      City*
                    </label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="Enter your city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <h2 className="text-xl font-semibold mb-4">Project Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="projectType" className="block text-sm font-medium text-lgt-dark mb-1">
                      Project Type*
                    </label>
                    <Select 
                      onValueChange={(value) => handleSelectChange('projectType', value)}
                      value={formData.projectType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="residential">Residential</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="industrial">Industrial</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-lgt-dark mb-2">
                      Services Needed* (Select all that apply)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="lowVoltage" 
                          checked={formData.servicesNeeded.lowVoltage} 
                          onCheckedChange={(checked) => handleCheckboxChange('lowVoltage', checked as boolean)}
                        />
                        <label htmlFor="lowVoltage" className="text-sm text-lgt-gray">
                          Low Voltage Systems
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="security" 
                          checked={formData.servicesNeeded.security} 
                          onCheckedChange={(checked) => handleCheckboxChange('security', checked as boolean)}
                        />
                        <label htmlFor="security" className="text-sm text-lgt-gray">
                          Security Systems
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="accessControl" 
                          checked={formData.servicesNeeded.accessControl} 
                          onCheckedChange={(checked) => handleCheckboxChange('accessControl', checked as boolean)}
                        />
                        <label htmlFor="accessControl" className="text-sm text-lgt-gray">
                          Access Control
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="cabling" 
                          checked={formData.servicesNeeded.cabling} 
                          onCheckedChange={(checked) => handleCheckboxChange('cabling', checked as boolean)}
                        />
                        <label htmlFor="cabling" className="text-sm text-lgt-gray">
                          Cabling & Infrastructure
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="smartBuilding" 
                          checked={formData.servicesNeeded.smartBuilding} 
                          onCheckedChange={(checked) => handleCheckboxChange('smartBuilding', checked as boolean)}
                        />
                        <label htmlFor="smartBuilding" className="text-sm text-lgt-gray">
                          Smart Building Integration
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="handyman" 
                          checked={formData.servicesNeeded.handyman} 
                          onCheckedChange={(checked) => handleCheckboxChange('handyman', checked as boolean)}
                        />
                        <label htmlFor="handyman" className="text-sm text-lgt-gray">
                          Handyman Services
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-lgt-dark mb-1">
                      Budget Range
                    </label>
                    <Select 
                      onValueChange={(value) => handleSelectChange('budget', value)}
                      value={formData.budget}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-1000">Under $1,000</SelectItem>
                        <SelectItem value="1000-5000">$1,000 - $5,000</SelectItem>
                        <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                        <SelectItem value="10000-25000">$10,000 - $25,000</SelectItem>
                        <SelectItem value="over-25000">Over $25,000</SelectItem>
                        <SelectItem value="not-sure">Not sure yet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label htmlFor="timeline" className="block text-sm font-medium text-lgt-dark mb-1">
                      Project Timeline
                    </label>
                    <Select 
                      onValueChange={(value) => handleSelectChange('timeline', value)}
                      value={formData.timeline}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="When do you need this completed?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asap">As soon as possible</SelectItem>
                        <SelectItem value="1-2-weeks">Within 1-2 weeks</SelectItem>
                        <SelectItem value="1-month">Within 1 month</SelectItem>
                        <SelectItem value="2-3-months">Within 2-3 months</SelectItem>
                        <SelectItem value="flexible">Flexible / No rush</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label htmlFor="details" className="block text-sm font-medium text-lgt-dark mb-1">
                      Project Details*
                    </label>
                    <Textarea
                      id="details"
                      name="details"
                      placeholder="Please provide as much detail as possible about your project needs"
                      rows={5}
                      value={formData.details}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-lgt-gray mb-4">
                  By submitting this form, you agree to be contacted regarding your request. We'll prepare a detailed quote based on the information provided.
                </p>
                <Button
                  type="submit"
                  className="px-8 py-2 bg-lgt-orange hover:bg-orange-600 text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting…' : 'Submit Quote Request'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default QuotePage;