
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Mail, Github, Twitter, Instagram } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const teamMembers = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Founder & Academic Lead',
      bio: 'PhD in Computer Science with 15 years of teaching experience.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    },
    {
      name: 'Michael Chen',
      role: 'Technical Director',
      bio: 'MSc in Software Engineering and former senior developer at Google.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    },
    {
      name: 'Priya Patel',
      role: 'Content Curator',
      bio: 'Educational consultant with expertise in curriculum development.',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    },
    {
      name: 'James Wilson',
      role: 'Student Experience Lead',
      bio: 'Former student representative with a passion for improving education.',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="bg-blue-50 py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-6">About CollegeSpace</h1>
                <p className="text-xl text-gray-600 leading-relaxed mb-8">
                  Empowering engineering students with quality study materials and resources since 2020.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  CollegeSpace was founded with a simple but powerful mission: to make quality educational resources accessible to all engineering students, regardless of their background or institution.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  We believe that education should be collaborative and community-driven. By providing a platform where students can access, share, and contribute to a growing library of study materials, we're building a ecosystem that benefits everyone involved.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="rounded-lg overflow-hidden shadow-xl"
              >
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
                  alt="Students collaborating"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold mb-6">Our Core Values</h2>
                <p className="text-gray-600 leading-relaxed">
                  These principles guide everything we do at CollegeSpace.
                </p>
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Accessibility",
                  description: "Making quality educational resources available to every student, regardless of their background.",
                  icon: <BookOpen className="h-10 w-10 text-blue-500" />,
                  delay: 0,
                },
                {
                  title: "Community",
                  description: "Building a collaborative environment where students help each other succeed.",
                  icon: <Users className="h-10 w-10 text-blue-500" />,
                  delay: 0.2,
                },
                {
                  title: "Quality",
                  description: "Ensuring all resources meet high standards of accuracy, relevance, and usefulness.",
                  icon: <BookOpen className="h-10 w-10 text-blue-500" />,
                  delay: 0.4,
                }
              ].map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: value.delay }}
                  className="bg-white p-8 rounded-lg shadow-md"
                >
                  <div className="mb-4">{value.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold mb-6">Meet Our Team</h2>
                <p className="text-gray-600 leading-relaxed">
                  The dedicated individuals behind CollegeSpace working to make education more accessible.
                </p>
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-lg shadow-md text-center"
                >
                  <div className="mb-4 mx-auto rounded-full overflow-hidden w-24 h-24">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-blue-600 mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-blue-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
                <p className="text-gray-600 leading-relaxed">
                  Have questions or feedback? We'd love to hear from you!
                </p>
              </motion.div>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <motion.div
                    initial={{ x: -30, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-blue-500 mr-3" />
                        <span>contact@collegespace.edu</span>
                      </div>
                      <div className="flex items-center">
                        <Github className="h-5 w-5 text-blue-500 mr-3" />
                        <a href="#" className="hover:text-blue-600">github.com/collegespace</a>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <h4 className="font-medium mb-2">Follow Us</h4>
                      <div className="flex space-x-4">
                        <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                          <Github size={20} />
                        </a>
                        <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                          <Twitter size={20} />
                        </a>
                        <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                          <Instagram size={20} />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ x: 30, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <h3 className="text-xl font-bold mb-4">Send Us a Message</h3>
                    <form className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Your Name
                        </label>
                        <Input id="name" placeholder="Enter your name" />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <Input id="email" type="email" placeholder="Enter your email" />
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                          Message
                        </label>
                        <textarea
                          id="message"
                          rows={4}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Type your message here..."
                        ></textarea>
                      </div>
                      <Button className="w-full">Send Message</Button>
                    </form>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </motion.div>
  );
};

export default AboutPage;
