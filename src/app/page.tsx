"use client";

import {  useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IJob } from "@/components/models";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [keyword, setKeyword] = useState<string>("");
  const [location, setLocation] = useState<string>("london");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = async () => {
    console.log("searching...");
    setLoading(true);
    fetch(`/api/jobs?keyword=${keyword}&location=${location}`)
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        return setJobs(data)
      })
      .catch((error) => console.error("Error fetching jobs:", error));
  };

  return (
    <>
      <div className="flex items-center justify-center space-x-2">
      <Input
          placeholder="keyword"
          className="w-60"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Input
          placeholder="location"
          className="w-60"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <Button onClick={handleSearch} disabled={loading}>Search</Button>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4">
        {jobs.map((job, index) => (
          <Card key={index} className="w-full">
            <CardHeader >
              <div className="flex justify-between">
                <div>
                  <CardTitle>{job.website} - {job.title}</CardTitle>
                  <CardDescription>{job.company}</CardDescription>
                </div>
                <div>
                  <Button variant="outline" onClick={() => window.open(job.url, '_blank')}>Open</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p><strong>Salary:</strong> {job.salary}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Type:</strong> {job.type}, <strong>Work Style:</strong> {job.workStyle}</p>
              <br />
              <p>{job.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
