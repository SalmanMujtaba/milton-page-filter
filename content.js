// Check if the header has the text 'Drop-in Sports'
const pageHeader = document.querySelector('#page-header');

if (pageHeader && pageHeader.textContent.trim() === 'Drop-in Sports') {
  console.log("Page header is 'Drop-in Sports'. Running the script...");

  let previousItemCount = 0;

  function clickLoadMoreUntilCondition() {
    // Find the "Load More" button and click it initially
    const loadMoreButton = document.querySelector('.bm-load-more-courses-link-container a');

    if (loadMoreButton) {
      console.log("Clicking 'Load More' to start loading data...");
      loadMoreButton.click();
    } else {
      console.log("'Load More' button not found. Exiting script.");
      return; // Exit if no "Load More" button is found
    }

    // Track the number of items initially
    previousItemCount = document.querySelectorAll('.bm-class-row').length;

    const observer = new MutationObserver(() => {
      // Check the number of items currently on the screen
      const currentItemCount = document.querySelectorAll('.bm-class-row').length;

      if (currentItemCount > previousItemCount) {
        console.log("Detected new items. Checking last marker-row...");

        // Update the previous item count
        previousItemCount = currentItemCount;

        // Find the "Load More" button
        const loadMoreButton = document.querySelector('.bm-load-more-courses-link-container a');

        if (loadMoreButton) {
          console.log("Found 'Load More' button. Checking last marker-row...");

          // Find all bm-marker-row elements and check the last one
          const markerRows = document.querySelectorAll('.bm-marker-row');
          const lastMarkerRow = markerRows[markerRows.length - 1];

          if (lastMarkerRow) {
            console.log("Last .bm-marker-row found. Checking for '2024 Sep 30th' in last container...");

            // Find the bm-marker-container within the last marker-row
            const markerContainer = lastMarkerRow.querySelector('.bm-marker-container');
            const h2Element = markerContainer ? markerContainer.querySelector('h2') : null;

            // Check if the h2 element contains "2024 Sep 30th"
            if (h2Element && h2Element.textContent.includes('2024 Sep 30th')) {
              console.log("Found '2024 Sep 30th' in the last .bm-marker-row. Stopping 'Load More' clicks.");
              observer.disconnect(); // Stop observing changes
              filterData(); // Apply filtering logic after the condition is met
            } else {
              console.log("'2024 Sep 30th' not found yet. Clicking 'Load More'...");
              // Click the "Load More" button to load more data
              loadMoreButton.click();
            }
          } else {
            console.log("No .bm-marker-row found.");
          }
        } else {
          console.log("'Load More' button not found. Stopping script.");
          observer.disconnect(); // Stop observing changes
        }
      }
    });

    // Start observing changes to the DOM
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function filterData() {
    console.log("Applying filtering logic...");

    document.querySelectorAll('.bm-marker-container h2').forEach(h2 => {
      const dateText = h2.textContent.trim();
      const dateParts = dateText.split(' ');
      const [year, month, day] = [dateParts[0], dateParts[1], dateParts[2].replace(/[^0-9]/g, '')];

      // Parse the date
      const date = new Date(`${month} ${day}, ${year}`);
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });

      // Add the day of the week to the heading
      h2.textContent = `${dateText} (${dayOfWeek})`;

      // Highlight the weekend days
      if (dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday') {
        h2.style.color = 'green'; // Highlight weekends in green
      } else {
        h2.style.color = ''; // Default color for weekdays
      }
    });

    document.querySelectorAll('.bm-class-row').forEach(container => {
      const eventDescription = container.querySelector('.bm-event-description');

      // Check if the child element contains the text 'Pickleball' and not 'Cancelled'
      if (!eventDescription ||
        !eventDescription.textContent.includes('Pickleball') ||
        eventDescription.textContent.includes('Book a Court') ||
        eventDescription.textContent.includes('Pickleball (Free Equipment Lending)') ||
        eventDescription.textContent.includes('Learn to Play') ||
        eventDescription.textContent.includes('Cancelled')) {
        console.log("Hiding container due to criteria not met.");
        container.style.display = 'none'; // Hide the container if the criteria are not met
      } else {
        const spotsLabel = container.querySelector('.bm-spots-left-label span');

        // Check if the span inside .bm-spots-left-label contains the text "Full"
        if (spotsLabel && spotsLabel.textContent.includes('Full')) {
          console.log("Hiding container because spots are 'Full'.");
          container.style.display = 'none'; // Hide the container if the span contains "Full"
        } else if (spotsLabel) {
          console.log("Making span color green.");
          spotsLabel.style.color = 'green'; // Make the span green if it's not "Full"
        }
      }
    });
  }

  // Start the process
  clickLoadMoreUntilCondition();
} else {
  console.log("Page header does not contain 'Drop-in Sports'. Script not running.");
}
