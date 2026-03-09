'use client'

import React from 'react'
import { FolderOpen, Info, Calendar, AlertCircle } from 'lucide-react'
import { ProjectInfoFormProps } from './types'

export function ProjectInfoForm({
  projectInfo,
  onChange,
  errors,
  minDeliveryDate,
  notesMaxLength = 500,
  showNotesCounter = true,
  projectNameHelperText = 'Deze naam wordt gebruikt op facturen en leveringsdocumenten.',
  deliveryDateHelperText = 'Standaard levertijd is 3-5 werkdagen. Voor spoedlevering neem contact op.',
  className = '',
}: ProjectInfoFormProps) {
  const notesLength = projectInfo?.notes?.length || 0
  const counterClass =
    notesLength >= notesMaxLength
      ? 'error'
      : notesLength >= notesMaxLength * 0.9
        ? 'warning'
        : ''

  return (
    <div className={`project-info-form ${className}`}>
      <div className="project-info-header">
        <h3 className="project-info-title">
          <FolderOpen className="project-info-title-icon" size={20} strokeWidth={2} />
          Projectinformatie
        </h3>
      </div>

      <div className="project-info-fields">
        {/* Project Name (required) */}
        <div className={`project-info-field ${errors?.projectName ? 'error' : ''}`}>
          <label className="project-info-label required" htmlFor="project-name">
            Projectnaam
          </label>
          <input
            type="text"
            id="project-name"
            className="project-info-input"
            value={projectInfo?.projectName || ''}
            onChange={(e) => onChange?.('projectName', e.target.value)}
            placeholder="Bijv. Q2 2024 Stock Replenishment"
            required
            aria-required="true"
            aria-invalid={!!errors?.projectName}
            aria-describedby={errors?.projectName ? 'project-name-error' : 'project-name-helper'}
          />
          {errors?.projectName ? (
            <p className="project-info-error-message" id="project-name-error" role="alert">
              <AlertCircle className="project-info-error-icon" size={14} strokeWidth={2} />
              {errors.projectName}
            </p>
          ) : (
            <p className="project-info-helper" id="project-name-helper">
              <Info className="project-info-helper-icon" size={14} strokeWidth={2} />
              {projectNameHelperText}
            </p>
          )}
        </div>

        {/* Delivery Date (required) */}
        <div className={`project-info-field ${errors?.deliveryDate ? 'error' : ''}`}>
          <label className="project-info-label required" htmlFor="delivery-date">
            Gewenste leverdatum
          </label>
          <input
            type="date"
            id="delivery-date"
            className="project-info-input"
            value={projectInfo?.deliveryDate || ''}
            onChange={(e) => onChange?.('deliveryDate', e.target.value)}
            min={minDeliveryDate}
            required
            aria-required="true"
            aria-invalid={!!errors?.deliveryDate}
            aria-describedby={
              errors?.deliveryDate ? 'delivery-date-error' : 'delivery-date-helper'
            }
          />
          {errors?.deliveryDate ? (
            <p className="project-info-error-message" id="delivery-date-error" role="alert">
              <AlertCircle className="project-info-error-icon" size={14} strokeWidth={2} />
              {errors.deliveryDate}
            </p>
          ) : (
            <p className="project-info-helper" id="delivery-date-helper">
              <Calendar className="project-info-helper-icon" size={14} strokeWidth={2} />
              {deliveryDateHelperText}
            </p>
          )}
        </div>

        {/* Notes (optional) */}
        <div className={`project-info-field ${errors?.notes ? 'error' : ''}`}>
          <label className="project-info-label" htmlFor="notes">
            Opmerkingen / Speciale wensen
          </label>
          <textarea
            id="notes"
            className="project-info-textarea"
            value={projectInfo?.notes || ''}
            onChange={(e) => onChange?.('notes', e.target.value)}
            placeholder="Bijv. speciale levertijden, verpakkingseisen, of vragen over producten..."
            maxLength={notesMaxLength}
            aria-describedby={showNotesCounter ? 'notes-counter' : undefined}
          />
          {showNotesCounter && (
            <div className={`project-info-counter ${counterClass}`} id="notes-counter" aria-live="polite">
              {notesLength} / {notesMaxLength}
            </div>
          )}
          {errors?.notes && (
            <p className="project-info-error-message" role="alert">
              <AlertCircle className="project-info-error-icon" size={14} strokeWidth={2} />
              {errors.notes}
            </p>
          )}
        </div>
      </div>

      <style jsx>{`
        .project-info-form {
          background: var(--white);
          border: 1px solid var(--grey);
          border-radius: var(--radius-xl);
          padding: 24px;
        }

        /* Header */
        .project-info-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }

        .project-info-title {
          font-family: var(--font-family-body);
          font-size: 16px;
          font-weight: 700;
          color: var(--navy);
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0;
        }

        .project-info-title-icon {
          color: var(--teal);
          flex-shrink: 0;
        }

        /* Form fields */
        .project-info-fields {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* Field */
        .project-info-field {
          display: flex;
          flex-direction: column;
        }

        .project-info-label {
          display: block;
          font-family: var(--font-family-body);
          font-size: 12px;
          font-weight: 600;
          color: var(--grey-dark);
          margin-bottom: 6px;
        }

        .project-info-label.required::after {
          content: '*';
          color: #ff6b6b;
          margin-left: 4px;
        }

        .project-info-input,
        .project-info-textarea {
          width: 100%;
          padding: 10px 14px;
          border: 1.5px solid var(--grey);
          border-radius: var(--radius);
          font-family: var(--font-family-body);
          font-size: 14px;
          color: var(--navy);
          background: var(--white);
          outline: none;
          transition: all var(--transition-base);
        }

        .project-info-input::placeholder,
        .project-info-textarea::placeholder {
          color: var(--grey-mid);
        }

        .project-info-input:hover,
        .project-info-textarea:hover {
          border-color: var(--grey-mid);
        }

        .project-info-input:focus,
        .project-info-textarea:focus {
          border-color: var(--teal);
          box-shadow: 0 0 0 3px var(--teal-glow);
        }

        /* Date input specific */
        .project-info-input[type='date'] {
          position: relative;
          cursor: pointer;
        }

        .project-info-input[type='date']::-webkit-calendar-picker-indicator {
          cursor: pointer;
          color: var(--grey-mid);
          padding: 4px;
        }

        /* Textarea */
        .project-info-textarea {
          min-height: 100px;
          resize: vertical;
          padding: 12px 14px;
        }

        /* Character counter */
        .project-info-counter {
          font-family: var(--font-family-body);
          font-size: 11px;
          color: var(--grey-mid);
          text-align: right;
          margin-top: 6px;
        }

        .project-info-counter.warning {
          color: #f59e0b;
        }

        .project-info-counter.error {
          color: #ff6b6b;
        }

        /* Helper text */
        .project-info-helper {
          font-family: var(--font-family-body);
          font-size: 11px;
          color: var(--grey-mid);
          margin: 6px 0 0;
          display: flex;
          align-items: flex-start;
          gap: 4px;
        }

        .project-info-helper-icon {
          flex-shrink: 0;
          margin-top: 1px;
        }

        /* Error state */
        .project-info-field.error .project-info-input,
        .project-info-field.error .project-info-textarea {
          border-color: #ff6b6b;
        }

        .project-info-field.error .project-info-label {
          color: #ff6b6b;
        }

        .project-info-error-message {
          font-family: var(--font-family-body);
          font-size: 11px;
          color: #ff6b6b;
          margin: 6px 0 0;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .project-info-error-icon {
          flex-shrink: 0;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .project-info-form {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  )
}
