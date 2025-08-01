import { useState, useEffect } from "react";
import { gapi } from "gapi-script";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { toast } from "react-hot-toast";
import "./CalendarPage.css";

export default function CalendarPage() {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    name: "",
    service: "",
  });
  const [events, setEvents] = useState([]);
  const [googleUser, setGoogleUser] = useState(null);

  const fetchCalendarEvents = () => {
    gapi.client.calendar.events
      .list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 50,
        orderBy: "startTime",
      })
      .then((response) => {
        const items = response.result.items || [];
        const mappedEvents = items.map((evt) => ({
          title: evt.summary,
          start: evt.start.dateTime || evt.start.date,
          end: evt.end.dateTime || evt.end.date,
          backgroundColor: "#6c757d",
          borderColor: "#6c757d",
          textColor: "white",
        }));
        setEvents(mappedEvents);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch Google Calendar events", err);
      });
  };

  useEffect(() => {
    function start() {
      gapi.client
        .init({
          apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
          ],
        })
        .then(() => {
          console.log("✅ Google API client initialized");
          const storedToken = localStorage.getItem("google_token");
          if (storedToken) {
            gapi.client.setToken({ access_token: storedToken });
            fetchCalendarEvents();
            gapi.client
              .request({
                path: "https://www.googleapis.com/oauth2/v2/userinfo",
              })
              .then((res) => {
                if (res.result) {
                  setGoogleUser({ email: res.result.email });
                } else {
                  setGoogleUser({ email: "Manager" });
                }
              })
              .catch(() => {
                setGoogleUser({ email: "Manager" });
              });
          }
        })
        .catch((error) => {
          console.error("❌ Error initializing Google API client", error);
        });
    }
    gapi.load("client", start);

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleGoogleLogin = () => {
    if (
      !window.google ||
      !window.google.accounts ||
      !window.google.accounts.oauth2
    ) {
      toast.error("Google Identity Services not loaded yet.");
      return;
    }
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      scope: "https://www.googleapis.com/auth/calendar.events",
      callback: (response) => {
        if (response.access_token) {
          localStorage.setItem("google_token", response.access_token);
          gapi.client.setToken({ access_token: response.access_token });
          toast.success("Signed in with Google!");
          setGoogleUser({ email: "Manager" });
          gapi.client
            .request({
              path: "https://www.googleapis.com/oauth2/v2/userinfo",
            })
            .then((res) => {
              if (res.result) {
                setGoogleUser({ email: res.result.email });
              }
            });
          fetchCalendarEvents();
        } else {
          toast.error("Failed to get Google token.");
        }
      },
    });
    tokenClient.requestAccessToken();
  };

  const handleDateSelect = (selectInfo) => {
    const start = selectInfo.startStr;
    const end = selectInfo.endStr;
    setSelectedSlot({ start, end });
    setShowBookingModal(true);
  };

  const handleDateClick = (info) => {
    const calendarApi = info.view.calendar;
    calendarApi.changeView("timeGridDay", info.dateStr);
  };

  return (
    <div className="calendar-page-container">
      <h2 className="calendar-title">📅 Book Your Slot</h2>

      <div className="google-login-section">
        {googleUser ? (
          <div className="google-login-info">
            ✅ Logged in as {googleUser.email}
          </div>
        ) : (
          <button onClick={handleGoogleLogin} className="google-login-btn">
            Sign in with Google (Manager)
          </button>
        )}
      </div>

      <div className="calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          selectable={true}
          selectMirror={true}
          select={handleDateSelect}
          dateClick={handleDateClick}
          selectAllow={() => true}
          headerToolbar={{
            left: "prev,next",
            center: "title",
            right: "today dayGridMonth,timeGridWeek,timeGridDay",
          }}
          buttonText={{
            today: "Today",
            month: "Month",
            week: "Week",
            day: "Day",
          }}
          height="auto"
          businessHours={{
            daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
            startTime: "09:30",
            endTime: "18:45",
          }}
          slotMinTime="09:30:00"
          slotMaxTime="18:45:00"
          allDaySlot={false}
          events={events}
          contentHeight="auto"
          aspectRatio={0.85}
          expandRows={true}
          themeSystem="standard"
        />
      </div>

      {showBookingModal && selectedSlot && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Book Slot</h3>
            <p>
              <strong>Start:</strong> {selectedSlot.start}
            </p>
            <p>
              <strong>End:</strong> {selectedSlot.end}
            </p>

            <label className="modal-label">Your Name</label>
            <input
              type="text"
              value={bookingDetails.name}
              onChange={(e) =>
                setBookingDetails({ ...bookingDetails, name: e.target.value })
              }
              className="modal-input"
            />

            <label className="modal-label">Requested Service</label>
            <textarea
              value={bookingDetails.service}
              onChange={(e) =>
                setBookingDetails({
                  ...bookingDetails,
                  service: e.target.value,
                })
              }
              className="modal-textarea"
            />

            <button
              className="confirm-btn"
              onClick={() => {
                setEvents([
                  ...events,
                  {
                    title: `${bookingDetails.name} - ${bookingDetails.service}`,
                    start: selectedSlot.start,
                    end: selectedSlot.end,
                    backgroundColor: "#d63384",
                    borderColor: "#d63384",
                    textColor: "white",
                  },
                ]);

                gapi.client.calendar.events
                  .insert({
                    calendarId: "primary",
                    resource: {
                      summary: `${bookingDetails.name} - ${bookingDetails.service}`,
                      start: { dateTime: selectedSlot.start },
                      end: { dateTime: selectedSlot.end },
                    },
                  })
                  .then(() => {
                    toast.success(
                      "✅ Booking confirmed & added to Google Calendar!"
                    );
                  })
                  .catch((err) => {
                    console.error("❌ Google Calendar API error:", err);
                    toast.error(
                      "Booking confirmed, but could not sync with Google Calendar."
                    );
                  });

                setShowBookingModal(false);
                setBookingDetails({ name: "", service: "" });
              }}
            >
              Confirm Booking
            </button>

            <button
              className="cancel-btn"
              onClick={() => setShowBookingModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
