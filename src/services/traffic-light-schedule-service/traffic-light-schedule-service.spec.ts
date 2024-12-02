import { Test, TestingModule } from "@nestjs/testing";
import { TrafficLightScheduleService } from "./traffic-light-schedule-service";

describe("TrafficLightScheduleService", () => {
  let service: TrafficLightScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrafficLightScheduleService],
    }).compile();

    service = module.get<TrafficLightScheduleService>(
      TrafficLightScheduleService
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
