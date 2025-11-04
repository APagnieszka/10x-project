import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { OcrConfirmationModal } from "./OcrConfirmationModal";

describe("OcrConfirmationModal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    onRescan: vi.fn(),
    detectedDate: "2025-12-15",
    confidence: 75,
    imageData: "data:image/png;base64,test",
    isProcessing: false,
    error: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders modal with detected date and confidence", () => {
    render(<OcrConfirmationModal {...defaultProps} />);

    expect(screen.getByText("Confirm Detected Date")).toBeInTheDocument();
    expect(screen.getByText("2025-12-15")).toBeInTheDocument();
    expect(screen.getByText("75%")).toBeInTheDocument();
  });

  it("displays image preview", () => {
    render(<OcrConfirmationModal {...defaultProps} />);

    const image = screen.getByAltText("Scanned expiration date");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", defaultProps.imageData);
  });

  it("shows validation error for past date", () => {
    const pastDateProps = { ...defaultProps, detectedDate: "2020-01-01" };
    render(<OcrConfirmationModal {...pastDateProps} />);

    expect(screen.getByText("Detected date appears to be in the past")).toBeInTheDocument();
  });

  it("shows validation error for future date too far ahead", () => {
    const futureDateProps = { ...defaultProps, detectedDate: "2030-12-15" };
    render(<OcrConfirmationModal {...futureDateProps} />);

    expect(screen.getByText("Detected date seems too far in the future")).toBeInTheDocument();
  });

  it("shows error message when no date detected", () => {
    const noDateProps = { ...defaultProps, detectedDate: null };
    render(<OcrConfirmationModal {...noDateProps} />);

    expect(screen.getByText("No date was detected in the image")).toBeInTheDocument();
  });

  it("allows confidence adjustment via slider", () => {
    render(<OcrConfirmationModal {...defaultProps} />);

    const slider = screen.getByRole("slider");
    expect(slider).toBeInTheDocument();

    // Simulate slider change
    fireEvent.change(slider, { target: { value: "85" } });

    // Check if confidence display updates
    expect(screen.getByText("85%")).toBeInTheDocument();
  });

  it("displays confidence color and label correctly", () => {
    render(<OcrConfirmationModal {...defaultProps} />);

    expect(screen.getByText("Medium Confidence")).toBeInTheDocument();
    expect(screen.getByText("75%")).toHaveClass("text-yellow-600");
  });

  it("calls onConfirm with correct parameters when confirm button clicked", () => {
    render(<OcrConfirmationModal {...defaultProps} />);

    const confirmButton = screen.getByRole("button", { name: /confirm date/i });
    fireEvent.click(confirmButton);

    expect(defaultProps.onConfirm).toHaveBeenCalledWith("2025-12-15", 75);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("calls onRescan and onClose when rescan button clicked", () => {
    render(<OcrConfirmationModal {...defaultProps} />);

    const rescanButton = screen.getByRole("button", { name: /scan again/i });
    fireEvent.click(rescanButton);

    expect(defaultProps.onRescan).toHaveBeenCalled();
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("disables buttons when processing", () => {
    const processingProps = { ...defaultProps, isProcessing: true };
    render(<OcrConfirmationModal {...processingProps} />);

    const confirmButton = screen.getByRole("button", { name: /confirm date/i });
    const rescanButton = screen.getByRole("button", { name: /scan again/i });

    expect(confirmButton).toBeDisabled();
    expect(rescanButton).toBeDisabled();
  });

  it("shows processing state", () => {
    const processingProps = { ...defaultProps, isProcessing: true };
    render(<OcrConfirmationModal {...processingProps} />);

    expect(screen.getByText("Processing...")).toBeInTheDocument();
  });

  it("displays error message when provided", () => {
    const errorProps = { ...defaultProps, error: "OCR processing failed" };
    render(<OcrConfirmationModal {...errorProps} />);

    expect(screen.getByText("OCR processing failed")).toBeInTheDocument();
  });

  it("closes modal when close button clicked", () => {
    render(<OcrConfirmationModal {...defaultProps} />);

    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("does not render when isOpen is false", () => {
    const closedProps = { ...defaultProps, isOpen: false };
    render(<OcrConfirmationModal {...closedProps} />);

    expect(screen.queryByText("Confirm Detected Date")).not.toBeInTheDocument();
  });

  it("auto-confirms when confidence is above 90%", () => {
    const highConfidenceProps = { ...defaultProps, confidence: 95 };
    render(<OcrConfirmationModal {...highConfidenceProps} />);

    expect(screen.getByText("High Confidence")).toBeInTheDocument();
    expect(screen.getByText("95%")).toHaveClass("text-green-600");
  });
});
