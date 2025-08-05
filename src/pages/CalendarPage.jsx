import { useState, useEffect } from "react";
import { gapi } from "gapi-script";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { toast } from "react-hot-toast";
import "./CalendarPage.css";
import BackLink from "../components/BackLink";

export default function CalendarPage() {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    name: "",
    service: "",
  });
  const [events, setEvents] = useState([]);
  const [googleUser, setGoogleUser] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);

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
          id: evt.id,
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
    setBookingDetails({ name: "", service: "" });
    setSelectedEventId(null);
    setShowBookingModal(true);
  };

  const handleDateClick = (info) => {
    const start = info.dateStr;
    const end = new Date(new Date(start).getTime() + 30 * 60 * 1000).toISOString(); // 30 min slot
    setSelectedSlot({ start, end });
    setBookingDetails({ name: "", service: "" });
    setSelectedEventId(null);
    setShowBookingModal(true);
  };

  return (
    <div className="calendar-page-container">
      <BackLink />
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
          dateClick={(info) => {
            const calendarApi = info.view.calendar;
            if (info.view.type === "dayGridMonth") {
              calendarApi.changeView("timeGridDay", info.date);
            } else {
              handleDateClick(info);
            }
          }}
          eventClick={(clickInfo) => {
            const event = clickInfo.event;
            setSelectedSlot({
              start: event.start.toISOString(),
              end: event.end.toISOString(),
            });
            setBookingDetails({
              name: event.title.split(" - ")[0] || "",
              service: event.title.split(" - ")[1] || "",
            });
            setSelectedEventId(event.id || null);
            setShowBookingModal(true);
          }}
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
          <div className="modal-card">
            <h3 className="modal-heading">📅 Book Appointment</h3>
            <div className="modal-times">
              <p>
                <strong>Start:</strong>{" "}
                {new Date(selectedSlot.start).toLocaleString()}
              </p>
              <p>
                <strong>End:</strong>{" "}
                {new Date(selectedSlot.end).toLocaleString()}
              </p>
            </div>

            <div className="modal-field">
              <label>Your Name</label>
              <input
                type="text"
                value={bookingDetails.name}
                onChange={(e) =>
                  setBookingDetails({ ...bookingDetails, name: e.target.value })
                }
                placeholder="e.g. Sarah Smith"
              />
            </div>

            <div className="modal-field">
              <label>Requested Service</label>
              <textarea
                value={bookingDetails.service}
                onChange={(e) =>
                  setBookingDetails({
                    ...bookingDetails,
                    service: e.target.value,
                  })
                }
                placeholder="e.g. Full Body Massage"
              />
            </div>

            <div className="modal-buttons">
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
                  setSelectedEventId(null);
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
              {selectedEventId && (
                <button
                  className="cancel-btn"
                  onClick={() => {
                    gapi.client.calendar.events
                      .delete({
                        calendarId: "primary",
                        eventId: selectedEventId,
                      })
                      .then(() => {
                        toast.success("Booking cancelled from Google Calendar");
                        setEvents(
                          events.filter((event) => {
                            const eventStart = new Date(
                              event.start
                            ).toISOString();
                            const eventEnd = new Date(event.end).toISOString();
                            return !(
                              eventStart === selectedSlot.start &&
                              eventEnd === selectedSlot.end &&
                              event.title ===
                                `${bookingDetails.name} - ${bookingDetails.service}`
                            );
                          })
                        );
                        setShowBookingModal(false);
                        setBookingDetails({ name: "", service: "" });
                        setSelectedEventId(null);
                      })
                      .catch((err) => {
                        console.error("Error cancelling event:", err);
                        toast.error("Failed to cancel booking.");
                      });
                  }}
                >
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
