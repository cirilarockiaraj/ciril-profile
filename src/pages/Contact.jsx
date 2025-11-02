import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';
import portfolioData from '../data/portfolio.json';
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useRef();
  // const { toast } = useToast();
  const { address, phone, email, mapEmbedPath } = portfolioData.contact;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // EmailJS Configuration (Dummy credentials - replace with actual)
    const serviceId = 'service_8ikmrkh';
    const templateId = 'template_k7vytsp';
    const publicKey = 'BMherVZI0_MnG8R76';
    console.log(form.current);

    try {
      await emailjs.sendForm(serviceId, templateId, form.current, publicKey);
      // toast({
      //   title: 'Success!',
      //   description: 'Your message has been sent successfully.',
      //   variant: 'default',
      // });
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "success",
        title: "Email sent successfully",
      });
      form.current.reset();
    } catch (error) {
      console.error('EmailJS Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: MapPin, label: 'Address', value: address },
    { icon: Phone, label: 'Phone', value: phone },
    { icon: Mail, label: 'Email', value: email },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-20">
      <div className="container mx-auto px-6">
        {/* Page Title */}
        <div
          className={`text-center mb-16 transition-all duration-1000 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h1 className="text-5xl font-bold mb-4">
            Get In <span className="text-blue-400">Touch</span>
          </h1>
          <div className="w-20 h-1 bg-blue-400 mx-auto mb-6"></div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Feel free to reach out for collaborations, opportunities, or just a friendly chat
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div
              className={`space-y-6 transition-all duration-1000 delay-200 transform ${
                isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
              }`}
            >
              <h2 className="text-3xl font-bold mb-8">Contact Information</h2>

              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <Card
                    key={index}
                    className="bg-slate-900 border-slate-800 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
                  >
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon className="text-blue-400" size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-1 text-gray-300">{info.label}</h3>
                        <p className="text-gray-400 text-sm">{info.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {/* Map */}
              <Card className="bg-slate-900 border-slate-800 overflow-hidden">
                <CardContent className="p-0">
                  <iframe
                    src={mapEmbedPath}
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Location Map"
                  ></iframe>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div
              className={`transition-all duration-1000 delay-400 transform ${
                isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
              }`}
            >
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="block text-2xl text-gray-300">Send Me a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form ref={form} onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="user_name" className="block text-sm font-medium mb-2 text-gray-300">
                        Your Name
                      </label>
                      <Input
                        id="user_name"
                        name="name"
                        type="text"
                        required
                        placeholder="John Doe"
                        className="bg-slate-800 border-slate-700 focus:border-blue-500 text-white placeholder:text-gray-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="user_email" className="block text-sm font-medium mb-2 text-gray-300">
                        Your Email
                      </label>
                      <Input
                        id="user_email"
                        name="email"
                        type="email"
                        required
                        placeholder="john@example.com"
                        className="bg-slate-800 border-slate-700 focus:border-blue-500 text-white placeholder:text-gray-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2 text-gray-300">
                        Subject
                      </label>
                      <Input
                        id="subject"
                        name="title"
                        type="text"
                        required
                        placeholder="Project Inquiry"
                        className="bg-slate-800 border-slate-700 focus:border-blue-500 text-white placeholder:text-gray-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-300">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        placeholder="Your message here..."
                        rows={6}
                        className="bg-slate-800 border-slate-700 focus:border-blue-500 text-white placeholder:text-gray-500 resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-6 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50"
                    >
                      {isSubmitting ? (
                        'Sending...'
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2" size={20} />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;