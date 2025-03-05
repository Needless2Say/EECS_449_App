"use client";

import React, {
  useContext,
  useState,
  useEffect,
  FormEvent,
  ChangeEvent,
} from "react";
import axios from "axios";

import AuthContext from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Example interfaces you could use
interface Workout {
  id: number;
  name: string;
  description: string;
}

interface Routine {
  id: number;
  name: string;
  description: string;
  workouts?: Workout[];
}

const Home: React.FC = () => {
  // If you have a defined type for your context, import and apply it here:
  // const { user, logout } = useContext<AuthContextType>(AuthContext);
  // For demonstration, we’ll simply use `any`:
  const { user, logout } = useContext<any>(AuthContext);

  // Type your state hooks
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [workoutName, setWorkoutName] = useState<string>("");
  const [workoutDescription, setWorkoutDescription] = useState<string>("");
  const [routineName, setRoutineName] = useState<string>("");
  const [routineDescription, setRoutineDescription] = useState<string>("");
  const [selectedWorkouts, setSelectedWorkouts] = useState<string[]>([]);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchWorkoutsAndRoutines = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        const [workoutsResponse, routinesResponse] = await Promise.all([
          axios.get("http://localhost:8000/workouts/workouts", {
            headers: { Authorization: `Bearer ${storedToken}` },
          }),
          axios.get("http://localhost:8000/routines", {
            headers: { Authorization: `Bearer ${storedToken}` },
          }),
        ]);

        setWorkouts(workoutsResponse.data);
        setRoutines(routinesResponse.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchWorkoutsAndRoutines();
  }, []);

  const handleCreateWorkout = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/workouts", {
        name: workoutName,
        description: workoutDescription,
      });
      setWorkouts([...workouts, response.data]);
      setWorkoutName("");
      setWorkoutDescription("");
    } catch (error) {
      console.error("Failed to create workout:", error);
    }
  };

  const handleCreateRoutine = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/routines", {
        name: routineName,
        description: routineDescription,
        workouts: selectedWorkouts,
      });
      setRoutineName("");
      setRoutineDescription("");
      setSelectedWorkouts([]);
    } catch (error) {
      console.error("Failed to create routine:", error);
    }
  };

  // Handle the multi-select for workouts
  const handleSelectWorkouts = (e: ChangeEvent<HTMLSelectElement>) => {
    // Convert the selected <option> elements to an array of values
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedWorkouts(selectedOptions);
  };

  return (
    <ProtectedRoute>
      <div className="container">
        <h1>Welcome!</h1>
        <button onClick={logout} className="btn btn-danger">
          Logout
        </button>

        <div className="accordion mt-5 mb-5" id="accordionExample">
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingOne">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                Create Workout
              </button>
            </h2>
            <div
              id="collapseOne"
              className="accordion-collapse collapse show"
              aria-labelledby="headingOne"
              data-bs-parent="#accordionExample"
            >
              <div className="accordion-body">
                <form onSubmit={handleCreateWorkout}>
                  <div className="mb-3">
                    <label htmlFor="workoutName" className="form-label">
                      Workout Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="workoutName"
                      value={workoutName}
                      onChange={(e) => setWorkoutName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="workoutDescription" className="form-label">
                      Workout Description
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="workoutDescription"
                      value={workoutDescription}
                      onChange={(e) => setWorkoutDescription(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Create Workout
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingTwo">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseTwo"
                aria-expanded="false"
                aria-controls="collapseTwo"
              >
                Create Routine
              </button>
            </h2>
            <div
              id="collapseTwo"
              className="accordion-collapse collapse"
              aria-labelledby="headingTwo"
              data-bs-parent="#accordionExample"
            >
              <div className="accordion-body">
                <form onSubmit={handleCreateRoutine}>
                  <div className="mb-3">
                    <label htmlFor="routineName" className="form-label">
                      Routine Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="routineName"
                      value={routineName}
                      onChange={(e) => setRoutineName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="routineDescription" className="form-label">
                      Routine Description
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="routineDescription"
                      value={routineDescription}
                      onChange={(e) => setRoutineDescription(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="workoutSelect" className="form-label">
                      Select Workouts
                    </label>
                    <select
                      multiple
                      className="form-control"
                      id="workoutSelect"
                      value={selectedWorkouts}
                      onChange={handleSelectWorkouts}
                    >
                      {workouts.map((workout) => (
                        <option key={workout.id} value={workout.id.toString()}>
                          {workout.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Create Routine
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3>Your routines:</h3>
          <ul>
            {routines.map((routine) => (
              <div className="card" key={routine.id}>
                <div className="card-body">
                  <h5 className="card-title">{routine.name}</h5>
                  <p className="card-text">{routine.description}</p>
                  <ul className="card-text">
                    {routine.workouts &&
                      routine.workouts.map((workout) => (
                        <li key={workout.id}>
                          {workout.name}: {workout.description}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            ))}
          </ul>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Home;
