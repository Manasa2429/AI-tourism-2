package com.designtravel.repository;

import com.designtravel.model.Itinerary;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItineraryRepository extends MongoRepository<Itinerary, String> {
    List<Itinerary> findByDestinationIdOrderByCreatedAtDesc(String destinationId);
    List<Itinerary> findAllByOrderByCreatedAtDesc();
}
