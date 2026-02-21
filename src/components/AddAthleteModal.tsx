import { useState } from "react";
import "./AddAthleteModal.css";

interface AddAthleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (athlete: {
    firstName: string;
    lastName: string;
    email: string;
    memberSince: string;
    lastContactedDate: null;
    tenureStatus: 'new' | 'tenured';
  }) => void;
}

export const AddAthleteModal = ({ isOpen, onClose, onSubmit }: AddAthleteModalProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [memberSince, setMemberSince] = useState(
    new Date().toISOString().split('T')[0]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      alert("First name and last name are required");
      return;
    }

    onSubmit({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      memberSince,
      lastContactedDate: null,
      tenureStatus: 'new', // Will be computed dynamically
    });

    // Reset form
    setFirstName("");
    setLastName("");
    setEmail("");
    setMemberSince(new Date().toISOString().split('T')[0]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Add Athlete</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="firstName">First Name *</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="lastName">Last Name *</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="memberSince">Member Since *</label>
            <input
              type="date"
              id="memberSince"
              value={memberSince}
              onChange={(e) => setMemberSince(e.target.value)}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Athlete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
