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
import { AuthContextType } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";


// interface for containing info on workouts
interface Workout {
    id: number;
    name: string;
    description: string;
}


// interface for containing info on routines
interface Routine {
    id: number;
    name: string;
    description: string;
    workouts?: Workout[];
}


// home page component
const Home: React.FC = () => {
    // If you have a defined type for your context, import and apply it here:
    // const { user, logout } = useContext<AuthContextType>(AuthContext);
    // For demonstration, we’ll simply use `any`:

    // initialize user and logout variables using custom context AuthContext
    const { user, logout } = useContext<AuthContextType>(AuthContext);

    // variable to hold list of workouts for logged in user
    const [workouts, setWorkouts] = useState<Workout[]>([]);

    // variable to hold list of routines for logged in user
    const [routines, setRoutines] = useState<Routine[]>([]);

    // variable to hold name of workout user wants to create
    const [workoutName, setWorkoutName] = useState<string>("");

    // variable to hold description for new workout user wants to create
    const [workoutDescription, setWorkoutDescription] = useState<string>("");

    // variable to hold name of new routine user wants to create
    const [routineName, setRoutineName] = useState<string>("");

    // variable to hold description for new routine user wants to create
    const [routineDescription, setRoutineDescription] = useState<string>("");

    // variable to hold list of workouts seleced
    const [selectedWorkouts, setSelectedWorkouts] = useState<string[]>([]);

    // variable to hold valid token that signifies that user is logged in
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    // runs when page is loaded for the first time
    useEffect(() => {
        // async function to fetch workouts and routines from database
        const fetchWorkoutsAndRoutines = async () => {
            // try following code
            try {
                // get valid token from bowser's local storage
                const storedToken = localStorage.getItem("token");

                // send 2 parallel GET requests to backend using axios
                // returns a list of workouts and routines from database
                const [workoutsResponse, routinesResponse] = await Promise.all([
                    // first query for workouts
                    axios.get("http://localhost:8000/workouts/workouts", {
                        // headers require authentication to query database
                        headers: { Authorization: `Bearer ${storedToken}` },
                    }),

                    // second query for routines
                    axios.get("http://localhost:8000/routines", {
                        // headers require authentication to query database
                        headers: { Authorization: `Bearer ${storedToken}` },
                    }),
                ]);

                // set workouts and routines list to contain list of workouts and routines respectively
                setWorkouts(workoutsResponse.data);
                setRoutines(routinesResponse.data);

            } catch (error) { // catch any errors
                // return error
                console.error("Failed to fetch data:", error);
            }
        };

        // call function to get workouts and routines from database
        fetchWorkoutsAndRoutines();
    }, []);

    // function to handle user creating a workout
    const handleCreateWorkout = async (e: FormEvent<HTMLFormElement>) => {
        // prevent default form submission behavior (normally reloads page)
        e.preventDefault();

        // try following code
        try {
            // send POST request to backend to store new workout under user's id
            // send associated workout name and description
            // api route returns newly created workout in database
            const response = await axios.post("http://localhost:8000/workouts", {
                name: workoutName,
                description: workoutDescription,
            });

            // set local workouts list to contain new workout and all previous workouts
            setWorkouts([...workouts, response.data]);

            // reinitialize workout name to empty string
            setWorkoutName("");

            // reinitialize workout description to empty string
            setWorkoutDescription("");

        } catch (error) { // catch any errors
            // return error
            console.error("Failed to create workout:", error);
        }
    };

    // function to handle user creating a routine
    const handleCreateRoutine = async (e: FormEvent<HTMLFormElement>) => {
        // prevent default form submission behavior (normally reloads page)
        e.preventDefault();

        // try following code
        try {
            // send POST request to backend to store new routine under user's id
            await axios.post("http://localhost:8000/routines", {
                name: routineName,
                description: routineDescription,
                workouts: selectedWorkouts,
            });

            // reinitialize routine name and description to empty strings
            setRoutineName("");
            setRoutineDescription("");

            // reinitialize selected workouts to empty list
            setSelectedWorkouts([]);

        } catch (error) { // catch any errors
            // return error message
            console.error("Failed to create routine:", error);
        }
    };

    // handle select for workouts in multi select
    const handleSelectWorkouts = (e: ChangeEvent<HTMLSelectElement>) => {
        // convert the selected <option> elements to an array of values
        const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);

        // set selected workouts to be array of selected workouts from multi select
        setSelectedWorkouts(selectedOptions);
    };

    return (
        // <ProtectedRoute>
            <div className="container">
                <h1>Welcome!</h1>
                <button onClick={logout} className="btn btn-danger">Logout</button>

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
                        <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                                <form onSubmit={handleCreateWorkout}>
                                    <div className="mb-3">
                                        <label htmlFor="workoutName" className="form-label">Workout Name</label>
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
                                        <label htmlFor="workoutDescription" className="form-label">Workout Description</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="workoutDescription"
                                            value={workoutDescription}
                                            onChange={(e) => setWorkoutDescription(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary">Create Workout</button>
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
                        <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                                <form onSubmit={handleCreateRoutine}>
                                    <div className="mb-3">
                                        <label htmlFor="routineName" className="form-label">Routine Name</label>
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
                                        <label htmlFor="routineDescription" className="form-label">Routine Description</label>
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
                                        <label htmlFor="workoutSelect" className="form-label">Select Workouts</label>
                                        <select
                                            multiple
                                            className="form-control"
                                            id="workoutSelect"
                                            value={selectedWorkouts}
                                            onChange={(e) => setSelectedWorkouts([...e.target.selectedOptions].map(option => option.value))}
                                        >
                                            {workouts.map(workout => (
                                                <option key={workout.id} value={workout.id}>
                                                    {workout.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <button type="submit" className="btn btn-primary">Create Routine</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h3>Your routines:</h3>
                    <ul>
                        {routines.map(routine => (
                            <div className="card" key={routine.id}>
                            <div className="card-body">
                            <h5 className="card-title">{routine.name}</h5>
                            <p className="card-text">{routine.description}</p>
                            <ul className="card-text"> 
                                {routine.workouts && routine.workouts.map(workout => (
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
        // </ProtectedRoute>
    );
};

export default Home;
