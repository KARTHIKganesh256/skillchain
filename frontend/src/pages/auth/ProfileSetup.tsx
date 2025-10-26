import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Building2, BookOpen, Award, Mail, Phone, MapPin } from 'lucide-react';

const ProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    college: '',
    department: '',
    course: '',
    year: '',
    rollNumber: '',
    phone: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: ''
  });

  const departments = [
    'Computer Science and Engineering (CSE)',
    'Artificial Intelligence & Machine Learning (AIML)',
    'Electronics and Communication Engineering (ECE)',
    'Electrical Engineering (EE)',
    'Mechanical Engineering (ME)',
    'Civil Engineering (CE)',
    'Chemical Engineering (CHE)',
    'Biomedical Engineering (BME)',
    'Biotechnology (BT)',
    'Data Science and Big Data Analytics (DS)',
    'Aerospace Engineering (AE)',
    'Automobile Engineering (AUTO)',
    'Environmental Engineering (ENE)',
    'Instrumentation and Control Engineering (ICE)',
    'Metallurgical/Materials Engineering (MME)',
    'Petroleum Engineering (PE)',
    'Industrial & Production Engineering (IPE)'
  ];

  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Save profile data to backend
      const response = await fetch('http://localhost:5000/api/profile/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

      // Save to localStorage for quick access
      localStorage.setItem('userProfile', JSON.stringify(formData));
      
      // Mark profile as completed
      localStorage.setItem('profileCompleted', 'true');
      
      // Redirect to profile page
      navigate('/profile');
    } catch (error) {
      console.error('Error saving profile:', error);
      // Still save to localStorage for demo purposes
      localStorage.setItem('userProfile', JSON.stringify(formData));
      localStorage.setItem('profileCompleted', 'true');
      navigate('/profile');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Complete Your Profile
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Help us personalize your SkillChain experience
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* College Name */}
            <div>
              <label htmlFor="college" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Building2 className="inline w-4 h-4 mr-2" />
                College Name
              </label>
              <input
                id="college"
                name="college"
                type="text"
                required
                value={formData.college}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your college name"
              />
            </div>

            {/* Department */}
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <BookOpen className="inline w-4 h-4 mr-2" />
                Department
              </label>
              <select
                id="department"
                name="department"
                required
                value={formData.department}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select your department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Course and Year */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="course" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Award className="inline w-4 h-4 mr-2" />
                  Course
                </label>
                <input
                  id="course"
                  name="course"
                  type="text"
                  required
                  value={formData.course}
                  onChange={handleChange}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., B.Tech, B.E."
                />
              </div>
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Year
                </label>
                <select
                  id="year"
                  name="year"
                  required
                  value={formData.year}
                  onChange={handleChange}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Roll Number */}
            <div>
              <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Roll Number / Student ID
              </label>
              <input
                id="rollNumber"
                name="rollNumber"
                type="text"
                required
                value={formData.rollNumber}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your roll number"
              />
            </div>

            {/* Contact Information */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Contact Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Phone className="inline w-4 h-4 mr-2" />
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <MapPin className="inline w-4 h-4 mr-2" />
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your address"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Emergency Contact
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contact Name
                  </label>
                  <input
                    id="emergencyContact"
                    name="emergencyContact"
                    type="text"
                    required
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter contact name"
                  />
                </div>
                <div>
                  <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contact Phone
                  </label>
                  <input
                    id="emergencyPhone"
                    name="emergencyPhone"
                    type="tel"
                    required
                    value={formData.emergencyPhone}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter contact phone"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-lg hover:shadow-xl"
              >
                Complete Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
