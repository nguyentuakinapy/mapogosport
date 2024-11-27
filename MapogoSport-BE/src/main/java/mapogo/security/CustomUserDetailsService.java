//package mapogo.security;
//
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Service;
//
//import mapogo.dao.UserDAO;
//import mapogo.entity.User;
//
//import java.util.List;
//
//@Service
//public class CustomUserDetailsService implements UserDetailsService {
//
//    private final UserDAO userRepository; // Thay bằng repository của bạn
//
//    public CustomUserDetailsService(UserDAO userRepository) {
//        this.userRepository = userRepository;
//    }
//
//    @Override
//    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//        User user = userRepository.findByUsername(username)
//            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
//
//        // Giả sử getAuthorities() trả về danh sách các đối tượng Authority
//        List<SimpleGrantedAuthority> authorities = user.getAuthorities().stream()
//            .map(auth -> new SimpleGrantedAuthority(auth.getRole().getName()))
//            .toList();
//
//        return new org.springframework.security.core.userdetails.User(
//            user.getUsername(),
//            user.getPassword(),
//            authorities
//        );
//    }
//
//
//}
