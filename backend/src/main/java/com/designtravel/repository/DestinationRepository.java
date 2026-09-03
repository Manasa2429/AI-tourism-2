package com.designtravel.repository;

import com.designtravel.model.Destination;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.GeoResults;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DestinationRepository extends MongoRepository<Destination, String> {

    List<Destination> findByContinentIgnoreCase(String continent);

    Page<Destination> findByNameContainingIgnoreCaseOrCountryContainingIgnoreCase(
            String name, String country, Pageable pageable
    );

    GeoResults<Destination> findByLocationNear(Point location, Distance maxDistance);

    @Query("{ 'tags': { $regex: ?0, $options: 'i' } }")
    List<Destination> findByTag(String tag);

    @Query("{ $and: [ " +
            "  { $or: [ " +
            "      { 'name': { $regex: ?0, $options: 'i' } }, " +
            "      { 'country': { $regex: ?0, $options: 'i' } }, " +
            "      { 'description': { $regex: ?0, $options: 'i' } } " +
            "  ] } " +
            "] }")
    Page<Destination> searchByKeyword(String keyword, Pageable pageable);
}
