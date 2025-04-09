import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import { SearchBar } from "@/app/components/SearchBar";
import { fetchLocations } from "@/requests/api";

// Mock the fetchLocations function
jest.mock("@/requests/api", () => ({
  fetchLocations: jest.fn(),
}));

const mockLocations = [
  {
    id: 1,
    name: "Biddinghuizen",
    city: "Dronten",
    country: "Netherlands",
    imageUrl: "https://placehold.co/600x400?text=Biddinghuizen",
  },
  {
    id: 2,
    name: "Ziggo Dome",
    city: "Amsterdam",
    country: "Netherlands",
    imageUrl: "https://placehold.co/600x400?text=Ziggo+Dome",
  },
];

describe("SearchBar", () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (fetchLocations as jest.Mock).mockResolvedValue({
      locations: mockLocations,
    });
  });

  it("renders with loading state initially", () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "All locations" })
    ).toBeInTheDocument();
  });

  it("loads and displays locations in select", async () => {
    await act(async () => {
      render(<SearchBar onSearch={mockOnSearch} />);
    });

    // Wait for locations to load
    await waitFor(() => {
      expect(screen.getByText("Biddinghuizen")).toBeInTheDocument();
      expect(screen.getByText("Ziggo Dome")).toBeInTheDocument();
    });

    // Verify all options are present
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(3); // All locations + 2 mock locations
  });

  it("calls onSearch when location is selected", async () => {
    await act(async () => {
      render(<SearchBar onSearch={mockOnSearch} />);
    });

    // Wait for locations to load
    await waitFor(() => {
      expect(screen.getByText("Biddinghuizen")).toBeInTheDocument();
    });

    // Select a location
    await act(async () => {
      fireEvent.change(screen.getByRole("combobox"), {
        target: { value: "Biddinghuizen" },
      });
    });

    // Verify onSearch was called with correct parameters
    expect(mockOnSearch).toHaveBeenCalledWith("", "Biddinghuizen");
  });

  it("handles fetch error gracefully", async () => {
    // Mock the fetch to reject
    (fetchLocations as jest.Mock).mockRejectedValue(
      new Error("Failed to load locations")
    );

    await act(async () => {
      render(<SearchBar onSearch={mockOnSearch} />);
    });

    // Verify select still works but only has default option
    await waitFor(() => {
      const options = screen.getAllByRole("option");
      expect(options).toHaveLength(1);
      expect(options[0]).toHaveTextContent("All locations");
    });
  });
});
