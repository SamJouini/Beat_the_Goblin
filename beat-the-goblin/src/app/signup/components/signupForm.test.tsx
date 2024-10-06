import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignupForm from '../signup/components/signupForm';
import { useRouter } from 'next/navigation';

// Mock the Next.js router to control navigation in tests
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Test suite for the SignupForm component
describe('SignupForm', () => {
  // Before each test, mock the useRouter hook to return an object with a push method
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
  });

  // Test case: Check if the signup form renders correctly
  test('renders signup form', () => {
    render(<SignupForm />);
    // Verify that all form elements are present
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
  });

  // Test case: Verify that form inputs update correctly on user input
  test('updates form data on input change', () => {
    render(<SignupForm />);
    // Get form input elements
    const usernameInput = screen.getByPlaceholderText('Username') as HTMLInputElement;
    const emailInput = screen.getByPlaceholderText('Email') as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;

    // Simulate user input
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Verify that input values have been updated
    expect(usernameInput.value).toBe('testuser');
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  // Test case: Verify form submission and redirection on successful signup
  test('submits form data and redirects on success', async () => {
    // Mock the router's push method
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });

    // Mock the global fetch function to simulate a successful API response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true }),
      })
    ) as jest.Mock;

    render(<SignupForm />);
    
    // Simulate user filling out the form
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });

    // Simulate form submission
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    // Wait for and verify the API call and redirection
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
        }),
      });
      expect(pushMock).toHaveBeenCalledWith('/login');
    });
  });

  // Test case: Verify error message display on signup failure
  test('displays error message on signup failure', async () => {
    // Mock the fetch function to simulate a failed API response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: false, message: 'Signup failed' }),
      })
    ) as jest.Mock;

    render(<SignupForm />);
    
    // Simulate form submission
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    // Wait for and verify the error message
    await waitFor(() => {
      expect(screen.getByText('Signup failed')).toBeInTheDocument();
    });
  });

  // Test case: Verify generic error message display on fetch failure
  test('displays generic error message on fetch failure', async () => {
    // Mock the fetch function to simulate a network error
    global.fetch = jest.fn(() => Promise.reject('API is down')) as jest.Mock;

    render(<SignupForm />);
    
    // Simulate form submission
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    // Wait for and verify the generic error message
    await waitFor(() => {
      expect(screen.getByText('An error occurred. Please try again.')).toBeInTheDocument();
    });
  });
});
